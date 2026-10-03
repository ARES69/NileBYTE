import { NextResponse } from 'next/server'
import { preflight, jres } from '@/lib/cors'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

/**
 * POST /api/scan — QR "SCAN THE NILE" landing event (SPEC §8, §36 брифа).
 * Body: { sku, batch?, stars?, storeSlug?, ref? , device? }
 * Creates a Scan row; flags repeat by device hash; optional rating update.
 * This is the owned CRM channel: store / pack batch / product / time / repeat / source.
 */
export function OPTIONS() { return preflight() }

export async function POST(req: Request) {
  const body = await req.json().catch(() => ({}))
  const sku = typeof body.sku === 'string' ? body.sku : null
  if (!sku) return jres({ error: 'sku-required' }, 400)

  const device = typeof body.device === 'string' ? body.device : null
  const seen = device ? await prisma.scan.findFirst({ where: { deviceId: device } }) : null
  const store = body.storeSlug ? await prisma.store.findUnique({ where: { slug: body.storeSlug } }) : null

  const scan = await prisma.scan.create({
    data: {
      sku,
      batch: body.batch === 'B' ? 'B' : body.batch === 'C' ? 'C' : 'A',
      stars: typeof body.stars === 'number' && body.stars >= 1 && body.stars <= 5 ? body.stars : null,
      storeId: store?.id ?? null,
      deviceId: device,
      referrer: typeof body.ref === 'string' ? body.ref.slice(0, 120) : null,
      repeat: !!seen
    }
  })
  return jres({ id: scan.id, repeat: scan.repeat })
}
