import { notFound } from 'next/navigation'
import { PrismaClient } from '@prisma/client'
import Link from 'next/link'

const prisma = new PrismaClient()

/**
 * /locations/[slug] — per-store page (SPEC §13.7 P1): hours incl. weekends,
 * address + delivery zones, NAP for local SEO, ORDER/MAP/WA/CALL, store QR.
 * Planned cities render a "coming soon" variant (noindex).
 */
export async function generateStaticParams() {
  const stores = await prisma.store.findMany({ select: { slug: true } })
  return stores.map(s => ({ slug: s.slug }))
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const s = await prisma.store.findUnique({ where: { slug } })
  if (!s) return { title: 'Nile Bites — Locations' }
  return {
    title: `Nile Bites ${s.city} — ${s.address}`,
    description: `Nile Bites ${s.city}: hours, delivery zones, order on site, talabat and elmenus.`,
    ...(s.live ? {} : { robots: 'noindex' })
  }
}

export default async function StorePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const store = await prisma.store.findUnique({ where: { slug } })
  if (!store) notFound()
  const hours = store.hours as { 'sunThu': string; 'friSat': string }

  return (
    <main className="wrap py-16">
      <p className="eyebrow">NILE BITES STORE</p>
      <h1 className="display text-6xl text-cream md:text-8xl">{store.city}</h1>
      <p className="mt-3 text-muted">{store.address}</p>

      <div className="mt-10 grid gap-6 md:grid-cols-2">
        <section className="card p-7">
          <h2 className="text-xs font-extrabold uppercase tracking-[0.24em] text-gold">Hours</h2>
          <ul className="mt-4 grid gap-2 text-sm">
            <li className="flex justify-between border-b border-cream/10 pb-2"><span>Sun — Thu</span><b>{hours.sunThu}</b></li>
            <li className="flex justify-between border-b border-cream/10 pb-2"><span>Fri — Sat</span><b>{hours.friSat}</b></li>
          </ul>
          <div className="mt-6 flex flex-wrap gap-3">
            {store.live && <Link href="/order" className="btn-gold">Order now</Link>}
            <a className="btn-line-light" href={store.mapsUrl} target="_blank" rel="noopener">Map</a>
            <a className="btn-line-light" href={`tel:${store.phone}`}>Call</a>
          </div>
        </section>
        <section className="card p-7">
          <h2 className="text-xs font-extrabold uppercase tracking-[0.24em] text-gold">Delivery zone</h2>
          <p className="mt-4 text-sm text-muted">
            {(store.delivery as { zones: string[] }).zones.join(' · ')} — 45–60 min, 20 EGP (free over 300 EGP).
          </p>
          <h2 className="mt-6 text-xs font-extrabold uppercase tracking-[0.24em] text-gold">Also on</h2>
          <p className="mt-3 text-sm">
            <a className="text-goldlt underline" href={(store.partners as { talabat: string }).talabat} target="_blank" rel="noopener">talabat</a>
            {' · '}
            <a className="text-goldlt underline" href={(store.partners as { elmenus: string }).elmenus} target="_blank" rel="noopener">elmenus</a>
          </p>
        </section>
      </div>
      {!store.live && <p className="mt-8 text-sm text-terra">Opening soon — join Nile Club to get the launch cup free.</p>}
    </main>
  )
}
