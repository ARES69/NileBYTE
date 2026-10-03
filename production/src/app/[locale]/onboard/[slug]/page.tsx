import { PrismaClient } from '@prisma/client'
import { OnboardForm } from './form'

const prisma = new PrismaClient()

/**
 * /onboard/[slug]?code=NB-INV-XXXX — store self-activation page (onboarding step 2).
 * Server component fetches store + on-sale products; client form posts to
 * POST /api/stores/[slug]/onboard. After QA the admin flips live=true.
 */
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  return { title: `Open your Nile Bites · ${slug}`, robots: 'noindex' }
}

export default async function OnboardPage({ params, searchParams }: {
  params: Promise<{ slug: string }>
  searchParams: Promise<{ code?: string }>
}) {
  const { slug } = await params
  const { code } = await searchParams
  const store = await prisma.store.findUnique({ where: { slug } })
  if (!store) return <main className="grid min-h-svh place-items-center bg-black text-cream">Store not found</main>
  const products = await prisma.product.findMany({ where: { onSale: true }, select: { slug: true, nameEn: true, priceEgp: true }, orderBy: { sortOrder: 'asc' } })

  return (
    <main className="wrap grid min-h-svh place-items-center py-16">
      <div className="card w-full max-w-2xl rounded-card border border-cream/10 bg-ink p-8">
        <p className="eyebrow">STORE ONBOARDING · STEP 2/3</p>
        <h1 className="display text-5xl text-cream">{store.city}</h1>
        <p className="mt-2 text-sm text-cream/60">{store.address} · invite {code ?? 'required'}</p>
        <OnboardForm slug={slug} code={code ?? ''} products={products} />
      </div>
    </main>
  )
}
