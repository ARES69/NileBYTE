import { notFound } from 'next/navigation'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

/**
 * /bite/[qr] — "YOUR BITE" QR landing (SPEC §8).
 * qr format: NB-{sku}-{batch}-{storeSlug}  e.g. NB-shawarma-A-hurghada
 * Flow: product reveal → rate ★ → points (if member) → refer a buddy.
 * Fires POST /api/scan on mount (client island <ScanTracker/>).
 */
export async function generateMetadata({ params }: { params: Promise<{ qr: string }> }) {
  const { qr } = await params
  return { title: `Your Bite — ${qr.split('-')[1] ?? ''} · Nile Bites`, robots: 'noindex' }
}

export default async function BitePage({ params }: { params: Promise<{ qr: string }> }) {
  const { qr } = await params
  const [, sku, batch, storeSlug] = qr.split('-')
  const product = await prisma.product.findUnique({ where: { slug: sku ?? '' } })
  if (!product) notFound()

  return (
    <main className="wrap grid min-h-svh place-items-center py-16">
      <section className="card max-w-md p-8 text-center">
        <p className="eyebrow justify-center">YOUR BITE</p>
        <h1 className="display text-5xl text-cream">{product.nameEn}</h1>
        <p className="mt-3 text-muted">{product.descEn}</p>
        {/* TODO: <ScanTracker sku={sku} batch={batch} storeSlug={storeSlug} /> */}
        {/* TODO: <StarRating sku={sku} /> → +10 pts per star-tier (Club) */}
        {/* TODO: <ReferBuddy /> — friend gets FREE SAUCE, referrer +50 */}
        <p className="mt-6 text-xs uppercase tracking-[0.22em] text-gold">Scan → Rate → Earn</p>
      </section>
    </main>
  )
}
