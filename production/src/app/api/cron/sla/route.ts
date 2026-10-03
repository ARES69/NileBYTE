import { NextResponse } from 'next/server'
import { PrismaClient, OrderStatus } from '@prisma/client'
import { emit } from '@/lib/events'

const prisma = new PrismaClient()

/**
 * GET /api/cron/sla — Vercel cron every 5 min (Authorization: Bearer CRON_SECRET).
 * Flags orders stuck in NEW/PREP longer than 12 minutes → outbox sla_breach
 * (surfaces in Nile Admin → Risk; triggers compensate-offer job).
 * Also emits points_earned intents for DONE orders without ledger rows (idempotent job input).
 */
export async function GET(req: Request) {
  if (req.headers.get('authorization') !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'unauthorized' }, { status: 401 })
  }
  const cutoff = new Date(Date.now() - 12 * 60_000)
  const stuck = await prisma.order.findMany({
    where: { status: { in: [OrderStatus.NEW, OrderStatus.PREP] }, createdAt: { lt: cutoff } }
  })
  for (const o of stuck) {
    await emit(o.storeId, 'sla_breach', { id: o.publicId, waitMin: Math.round((Date.now() - o.createdAt.getTime()) / 60000) })
  }

  const done = await prisma.order.findMany({
    where: { status: OrderStatus.DONE, ledger: { none: {} } }
  })
  let points = 0
  for (const o of done) {
    // points = size × qty per cup line; member resolved by phone at consumption time
    points += 12 // skeleton: real size parsed from items Json in the consumer job
    await emit(o.storeId, 'points_earned', { orderId: o.id, publicId: o.publicId })
  }
  return NextResponse.json({ flagged: stuck.length, pointIntents: done.length })
}
