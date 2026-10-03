import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import { randomBytes } from 'crypto'
import { getSession, requireRole } from '@/lib/auth'
import { emit } from '@/lib/events'

const prisma = new PrismaClient()

/** GET /api/stores — admin: all stores with onboarding state. */
export async function GET(req: Request) {
  const s = requireRole(await getSession(req), 'admin')
  const stores = await prisma.store.findMany({
    orderBy: { createdAt: 'asc' },
    include: { _count: { select: { orders: true, staff: true } } }
  })
  return NextResponse.json({ stores, actor: s.email })
}

/**
 * POST /api/stores — admin: create a store + invite code.
 * This is step 1 of "connecting a restaurant": franchise signed → store created → invite sent.
 * Body: { slug, city, cityAr, address, addressAr, lat, lng, phone, mapsUrl }
 */
export async function POST(req: Request) {
  requireRole(await getSession(req), 'admin')
  const b = await req.json()
  const store = await prisma.store.create({
    data: {
      slug: b.slug, city: b.city, cityAr: b.cityAr, address: b.address, addressAr: b.addressAr,
      lat: b.lat, lng: b.lng, phone: b.phone, mapsUrl: b.mapsUrl ?? '',
      live: false,
      hours: { sunThu: '10:00 — 02:00', friSat: '10:00 — 03:00' },
      delivery: { zones: [], feeEgp: 20, freeOverEgp: 300, etaMin: [45, 60] },
      partners: { talabat: '', elmenus: '' }
    }
  })
  const invite = await prisma.storeInvite.create({
    data: {
      code: 'NB-INV-' + randomBytes(4).toString('hex').toUpperCase(),
      storeId: store.id,
      expiresAt: new Date(Date.now() + 14 * 86400_000)
    }
  })
  await emit(store.id, 'store_live', { stage: 'created', slug: store.slug })
  return NextResponse.json({ storeId: store.id, inviteCode: invite.code, inviteUrl: `${process.env.NEXT_PUBLIC_SITE_URL}/onboard/${store.slug}?code=${invite.code}` }, { status: 201 })
}
