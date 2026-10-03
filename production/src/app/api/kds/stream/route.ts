import { PrismaClient } from '@prisma/client'
import { getSession, requireRole, scopeStore } from '@/lib/auth'
import { readAfter } from '@/lib/events'

const prisma = new PrismaClient()

/**
 * GET /api/kds/stream?storeId=…&after=0 — Server-Sent Events for kitchen displays.
 * Auth: kitchen | manager | admin. Tenancy: scopeStore pins staff to their store.
 * Transport: poll Outbox every 1.5 s (skeleton); upgrade → PG LISTEN/NOTIFY → Redis Streams.
 * Events pushed: order_new, order_status, order_paid, order_cancel, sla_breach.
 */
export const dynamic = 'force-dynamic'

export async function GET(req: Request) {
  // EventSource cannot set headers: accept ?token= as a fallback (KDS screens), cookie/Bearer elsewhere
  const url = new URL(req.url)
  const qToken = url.searchParams.get('token')
  if (qToken && !req.headers.get('authorization')) req.headers.set('authorization', 'Bearer ' + qToken)
  const session = requireRole(await getSession(req), 'kitchen', 'manager', 'admin')
  let storeId: string
  try {
    storeId = scopeStore(session, new URL(req.url).searchParams.get('storeId'))
  } catch {
    return new Response('forbidden', { status: 403 })
  }
  let after = parseInt(new URL(req.url).searchParams.get('after') ?? '0', 10) || 0

  const stream = new ReadableStream({
    async pull(controller) {
      const enc = new TextEncoder()
      const events = await readAfter(storeId, after)
      for (const e of events) {
        after = e.id
        controller.enqueue(enc.encode(`id: ${e.id}\nevent: ${e.type}\ndata: ${JSON.stringify(e.payload)}\n\n`))
      }
      // heartbeat keeps proxies alive
      controller.enqueue(enc.encode(': ping\n\n'))
      await new Promise(r => setTimeout(r, 1500))
    },
    cancel() { /* client disconnected: KDS screen off */ }
  })

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache, no-transform',
      Connection: 'keep-alive',
      'X-Accel-Buffering': 'no'
    }
  })
}
