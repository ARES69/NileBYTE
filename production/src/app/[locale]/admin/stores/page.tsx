import { prisma } from '@/lib/db'
import { CreateStore } from '@/components/admin/CreateStore'

/** /admin/stores — network view + onboarding pipeline (invite → onboarded → live). */
export const dynamic = 'force-dynamic'

export default async function AdminStores() {
  const stores = await prisma.store.findMany({
    orderBy: { createdAt: 'asc' },
    include: { invites: { orderBy: { createdAt: 'desc' }, take: 1 }, _count: { select: { orders: true, staff: true } } }
  })
  return (
    <div className="grid gap-5">
      <h1 className="display text-3xl">STORES · NETWORK</h1>
      <CreateStore />
      <div className="grid gap-4 lg:grid-cols-2">
        {stores.map(s => {
          const inv = s.invites[0]
          const stage = s.live ? 'LIVE' : inv?.used ? 'READY FOR QA' : 'INVITED'
          return (
            <section key={s.id} className="rounded-card border border-cream/10 bg-ink p-5">
              <div className="flex items-baseline gap-3">
                <h2 className="font-display text-2xl text-cream">{s.city}</h2>
                <span className={`ml-auto rounded-pill border px-3 py-1 text-[10px] font-black uppercase tracking-widest ${s.live ? 'border-emerald-300/50 text-emerald-300' : inv?.used ? 'border-gold/50 text-goldlt' : 'border-cream/25 text-cream/60'}`}>{stage}</span>
              </div>
              <p className="mt-1 text-sm text-cream/60">{s.address}</p>
              <p className="mt-3 text-xs text-cream/50">orders: <b className="text-cream">{s._count.orders}</b> · staff: <b className="text-cream">{s._count.staff}</b> · slug: {s.slug}</p>
              {inv && !inv.used && <p className="mt-2 text-xs text-goldlt">invite: {inv.code} · expires {inv.expiresAt.toISOString().slice(0, 10)}</p>}
              <p className="mt-2 text-[11px] text-cream/40">onboard url: /onboard/{s.slug}?code={inv?.code ?? '…'}</p>
            </section>
          )
        })}
      </div>
    </div>
  )
}
