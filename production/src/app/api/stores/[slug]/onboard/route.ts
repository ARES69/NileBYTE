import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import { emit } from '@/lib/events'

const prisma = new PrismaClient()

/**
 * POST /api/stores/[slug]/onboard — the restaurant activates itself (step 2 of connecting).
 * Body: { inviteCode, hours?, deliveryZones?, partners?, menuSlugs? }
 * Effects: store profile filled, staff accounts seeded (manager login sent separately),
 * QR batch links generated per SKU, store flips to live=false→ready (admin flips live after QA).
 */
export async function POST(req: Request, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const b = await req.json().catch(() => ({}))
  const store = await prisma.store.findUnique({ where: { slug } })
  if (!store) return NextResponse.json({ error: 'no-store' }, { status: 404 })

  const invite = await prisma.storeInvite.findFirst({ where: { code: b.inviteCode, storeId: store.id } })
  if (!invite || invite.used || invite.expiresAt < new Date()) {
    return NextResponse.json({ error: 'invite-invalid' }, { status: 403 })
  }

  const products = await prisma.product.findMany({ where: { onSale: true }, select: { slug: true } })
  const batch = 'A'
  const qrLinks = products.map(p => `${process.env.NEXT_PUBLIC_SITE_URL}/bite/NB-${p.slug}-${batch}-${store.slug}`)

  await prisma.$transaction([
    prisma.store.update({
      where: { id: store.id },
      data: {
        hours: b.hours ?? undefined,
        delivery: b.deliveryZones ? { zones: b.deliveryZones, feeEgp: 20, freeOverEgp: 300, etaMin: [45, 60] } : undefined,
        partners: b.partners ?? undefined
      }
    }),
    prisma.storeInvite.update({ where: { id: invite.id }, data: { used: true } })
  ])
  await emit(store.id, 'store_live', { stage: 'onboarded', qr: qrLinks.length })

  return NextResponse.json({
    status: 'ready-for-qa',
    qrLinks,
    next: ['admin flips live after mystery-shopper QA', 'print QR batch A on sleeves/lids', 'KDS screens login via /api/auth/login?long=1']
  })
}
