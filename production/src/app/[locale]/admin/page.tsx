import { prisma } from '@/lib/db'
import { LiveFeed } from '@/components/admin/LiveFeed'

/** /admin — Sales dashboard from real DB (no localStorage anymore). */
export const dynamic = 'force-dynamic'

export default async function AdminSales() {
  const dayStart = new Date(); dayStart.setHours(0, 0, 0, 0)
  const [orders, scans, members] = await Promise.all([
    prisma.order.findMany({ where: { createdAt: { gte: dayStart } } }),
    prisma.scan.count({ where: { createdAt: { gte: dayStart } } }),
    prisma.clubMember.count()
  ])
  const paid = orders.filter(o => o.status !== 'CANCELLED')
  const revenue = paid.reduce((a, o) => a + o.totalEgp, 0)
  const cancelled = orders.length - paid.length
  const avg = paid.length ? Math.round(revenue / paid.length) : 0

  // top products from items Json
  const counts: Record<string, number> = {}
  for (const o of paid) {
    const items = (o.items as unknown as { bite?: string }[]) ?? []
    for (const it of Array.isArray(items) ? items : [items]) counts[it.bite ?? '?'] = (counts[it.bite ?? '?'] ?? 0) + 1
  }
  const top = Object.entries(counts).sort((a, b) => b[1] - a[1])[0]

  // hourly buckets
  const hours = Array.from({ length: 16 }, (_, i) => ({ h: (10 + i) % 24, n: 0 }))
  for (const o of paid) {
    const h = new Date(o.createdAt).getHours()
    const b = hours.find(x => x.h === h)
    if (b) b.n++
  }
  const maxH = Math.max(1, ...hours.map(x => x.n))

  const kpi = (t: string, v: string, note: string, red = false) => (
    <div className="rounded-card border border-cream/10 bg-ink p-4">
      <p className="text-[10px] font-extrabold uppercase tracking-[0.2em] text-cream/50">{t}</p>
      <p className={`mt-2 font-display text-3xl ${red ? 'text-red' : 'text-goldlt'}`}>{v}</p>
      <p className="mt-1 text-[11px] text-cream/50">{note}</p>
    </div>
  )

  return (
    <div className="grid gap-5">
      <h1 className="display text-3xl">SALES · TODAY</h1>
      <div className="grid gap-3 sm:grid-cols-3 xl:grid-cols-6">
        {kpi('Orders', String(orders.length), 'all channels')}
        {kpi('Revenue', revenue.toLocaleString('en-US'), 'EGP net of cancels')}
        {kpi('Avg check', String(avg), 'EGP')}
        {kpi('Top product', top?.[0] ?? '—', `${top?.[1] ?? 0} cups`)}
        {kpi('Scans today', String(scans), 'QR cup → CRM')}
        {kpi('Cancellations', String(cancelled), cancelled > orders.length * 0.02 ? 'above 2% target!' : 'within target', cancelled > orders.length * 0.02)}
      </div>
      <div className="grid gap-5 lg:grid-cols-[1.4fr_1fr]">
        <section className="rounded-card border border-cream/10 bg-ink p-5">
          <h2 className="mb-4 text-[11px] font-extrabold uppercase tracking-[0.22em] text-cream/50">Orders by hour</h2>
          <div className="flex h-40 items-end gap-1.5">
            {hours.map(x => (
              <div key={x.h} className="grid flex-1 justify-items-center gap-1">
                <div className={`w-full rounded-t-md ${x.n === maxH ? 'bg-gold' : 'bg-gold/35'}`} style={{ height: `${(x.n / maxH) * 130 || 2}px` }} />
                <span className="text-[9px] text-cream/40">{x.h}</span>
              </div>
            ))}
          </div>
        </section>
        <LiveFeed />
      </div>
      <p className="text-xs text-cream/40">Members in Nile Club: {members.toLocaleString('en-US')} · data source: PostgreSQL (Prisma) + Outbox stream.</p>
    </div>
  )
}
