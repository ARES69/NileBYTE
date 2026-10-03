import { NextResponse } from 'next/server'
import { PrismaClient, OrderStatus } from '@prisma/client'
import { getSession, requireRole, scopeStore } from '@/lib/auth'
import { emit } from '@/lib/events'

const prisma = new PrismaClient()

const NEXT: Record<string, OrderStatus[]> = {
  NEW:    [OrderStatus.PREP, OrderStatus.CANCELLED],
  PREP:   [OrderStatus.READY, OrderStatus.CANCELLED],
  READY:  [OrderStatus.DONE],
  DONE:   [],
  CANCELLED: []
}

/**
 * PATCH /api/orders/[id]/status — status machine (KDS bump/fire, manager cancel).
 * Body: { status: 'PREP' | 'READY' | 'DONE' | 'CANCELLED', why? }
 * Roles: kitchen may only advance its own store (NEW→PREP→READY); manager+ may DONE/CANCEL.
 * Every transition emits order_status (KDS SSE + admin live feed).
 */
export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const session = requireRole(await getSession(req), 'kitchen', 'manager', 'admin')
  const body = await req.json().catch(() => ({}))
  const target = body.status as OrderStatus
  const order = await prisma.order.findUnique({ where: { publicId: id } })
  if (!order) return NextResponse.json({ error: 'no-order' }, { status: 404 })

  try { scopeStore(session, order.storeId) } catch { return NextResponse.json({ error: 'forbidden' }, { status: 403 }) }
  if (!NEXT[order.status]?.includes(target)) {
    return NextResponse.json({ error: `illegal transition ${order.status}->${target}` }, { status: 409 })
  }
  if (session.role === 'kitchen' && (target === OrderStatus.DONE || target === OrderStatus.CANCELLED)) {
    return NextResponse.json({ error: 'kitchen cannot close/cancel' }, { status: 403 })
  }

  const updated = await prisma.order.update({ where: { id: order.id }, data: { status: target } })
  await emit(order.storeId, 'order_status', { id: order.publicId, from: order.status, to: target, why: body.why ?? null })
  return NextResponse.json({ id: updated.publicId, status: updated.status })
}
