import { PrismaClient, type Prisma } from '@prisma/client'

const prisma = new PrismaClient()

/**
 * Outbox-based event bus (lib/events.ts).
 * Producers: API routes (order status changes, payments, onboarding, cron).
 * Consumers: KDS SSE stream, admin live feed, points/SLA/winback jobs.
 * Upgrade path: swap polling for PG LISTEN/NOTIFY, then Redis Streams at 50+ stores.
 */
export type EventType =
  | 'order_new' | 'order_status' | 'order_paid' | 'order_cancel'
  | 'sla_breach' | 'store_live' | 'points_earned' | 'scan_new' | 'lead_stage'

export async function emit(storeId: string | null, type: EventType, payload: Record<string, unknown>) {
  return prisma.outbox.create({ data: { storeId, type, payload: payload as Prisma.InputJsonValue } })
}

export async function readAfter(storeId: string, afterId: number, take = 100) {
  return prisma.outbox.findMany({
    where: { storeId, id: { gt: afterId } },
    orderBy: { id: 'asc' },
    take
  })
}
