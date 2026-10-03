import { NextResponse } from 'next/server'
import { createHmac, timingSafeEqual } from 'crypto'
import { PrismaClient, OrderStatus } from '@prisma/client'
import { emit } from '@/lib/events'

const prisma = new PrismaClient()

/**
 * POST /api/webhooks/paymob — payment gateway callbacks (Egypt cards/wallets).
 * Verify: HMAC-SHA256(raw body, PAYMOB_WEBHOOK_SECRET) in x-paymob-signature.
 * Effects: order paid → status NEW (kitchen may start), outbox order_paid,
 *          on DONE later the points job credits Nile Club (see jobs notes in BACKEND.md).
 */
export async function POST(req: Request) {
  const secret = process.env.PAYMOB_WEBHOOK_SECRET
  const raw = Buffer.from(await req.arrayBuffer())
  const sig = req.headers.get('x-paymob-signature') ?? ''
  if (!secret) return NextResponse.json({ error: 'not-configured' }, { status: 501 })
  const expect = createHmac('sha256', secret).update(raw).digest('hex')
  const a = Buffer.from(sig), b = Buffer.from(expect)
  if (a.length !== b.length || !timingSafeEqual(a, b)) {
    return NextResponse.json({ error: 'bad-signature' }, { status: 401 })
  }

  const body = JSON.parse(raw.toString('utf8'))
  const order = await prisma.order.findUnique({ where: { publicId: body.order_public_id } })
  if (!order) return NextResponse.json({ error: 'unknown-order' }, { status: 404 })

  if (body.status === 'PAID') {
    await prisma.order.update({ where: { id: order.id }, data: { payRef: body.txn_id, status: OrderStatus.NEW } })
    await emit(order.storeId, 'order_paid', { id: order.publicId, total: order.totalEgp, method: order.payMethod })
  } else if (body.status === 'FAILED') {
    await prisma.order.update({ where: { id: order.id }, data: { status: OrderStatus.CANCELLED } })
    await emit(order.storeId, 'order_cancel', { id: order.publicId, why: 'payment failed' })
  }
  return NextResponse.json({ ok: true })
}
