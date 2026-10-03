import { NextResponse } from 'next/server'
import { preflight, jres } from '@/lib/cors'
import { PrismaClient, OrderChannel, OrderStatus } from '@prisma/client'
import { CupSchema, quote } from '@/lib/pricing'
import { emit } from '@/lib/events'

const prisma = new PrismaClient()

/**
 * POST /api/order — create order from site checkout (SPEC §13.7).
 * Body: { cup, mode, promo?, name, phone, storeSlug, payMethod }
 * Returns: { publicId, totalEgp, points, eta }
 * Payments: create gateway session (Paymob) after this call in the client flow.
 */
export function OPTIONS() { return preflight() }

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const cup = CupSchema.parse(body.cup)
    const mode = body.mode === 'delivery' ? 'delivery' : 'pickup'
    const q = quote(cup, mode, body.promo)

    const store = await prisma.store.findUnique({ where: { slug: body.storeSlug ?? 'hurghada' } })
    if (!store || !store.live) return jres({ error: 'store-not-live' }, 409)

    const order = await prisma.order.create({
      data: {
        publicId: 'NB-' + Math.floor(2000 + Math.random() * 7999),
        storeId: store.id,
        channel: body.channel === 'whatsapp' ? OrderChannel.WHATSAPP : OrderChannel.SITE,
        status: OrderStatus.NEW,
        items: [{ ...cup, unit: q.unit }],
        subtotalEgp: q.subtotal,
        deliveryEgp: q.delivery,
        discountEgp: q.discount,
        totalEgp: q.total,
        payMethod: body.payMethod ?? 'card',
        name: body.name ?? null,
        phone: body.phone ?? null,
        promo: body.promo ?? null
      }
    })

    await emit(order.storeId, 'order_new', { id: order.publicId, ts: Date.now(), items: cup.qty + 'x ' + cup.bite + '/' + cup.size + ' ' + cup.sauce, ch: 'site', total: q.total })
    return jres({ publicId: order.publicId, totalEgp: q.total, points: q.points, eta: mode === 'delivery' ? '45-60 min' : '~4 min' })
  } catch (e) {
    return jres({ error: 'invalid-payload' }, 400)
  }
}
