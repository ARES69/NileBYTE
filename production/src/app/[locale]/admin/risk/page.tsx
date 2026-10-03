import { prisma } from '@/lib/db'

/** /admin/risk — the dark side from real data: cancels, SLA breaches (outbox), low-star scans, refunds intent. */
export const dynamic = 'force-dynamic'

export default async function AdminRisk() {
  const dayStart = new Date(); dayStart.setHours(0, 0, 0, 0)
  const [cancelled, breaches, complaints, all] = await Promise.all([
    prisma.order.findMany({ where: { status: 'CANCELLED', createdAt: { gte: dayStart } }, orderBy: { createdAt: 'desc' }, take: 30 }),
    prisma.outbox.findMany({ where: { type: 'sla_breach', createdAt: { gte: dayStart } }, orderBy: { createdAt: 'desc' }, take: 30 }),
    prisma.scan.findMany({ where: { stars: { lte: 2 }, createdAt: { gte: dayStart } }, orderBy: { createdAt: 'desc' }, take: 30 }),
    prisma.order.count({ where: { createdAt: { gte: dayStart } } })
  ])
  const rate = all ? (cancelled.length / all) * 100 : 0
  const card = (t: string, v: string, note: string, red = true) => (
    <div className="rounded-card border border-cream/10 bg-ink p-4">
      <p className="text-[10px] font-extrabold uppercase tracking-[0.2em] text-cream/50">{t}</p>
      <p className={`mt-2 font-display text-3xl ${red ? 'text-red' : 'text-cream'}`}>{v}</p>
      <p className="mt-1 text-[11px] text-cream/50">{note}</p>
    </div>
  )
  return (
    <div className="grid gap-5">
      <h1 className="display text-3xl">RISK & EXCEPTIONS</h1>
      <div className="grid gap-3 sm:grid-cols-4">
        {card('Cancellations', String(cancelled.length), `${rate.toFixed(1)}% of today · target <2%`, rate > 2)}
        {card('SLA breaches', String(breaches.length), 'wait > 12 min (cron-flagged)')}
        {card('Complaints 1–2★', String(complaints.length), 'from QR scans today')}
        {card('Refund intents', String(cancelled.filter(c => c.payRef).length), 'paid orders cancelled → refund flow')}
      </div>
      <div className="grid gap-5 lg:grid-cols-2">
        <section className="rounded-card border border-cream/10 bg-ink p-5">
          <h2 className="mb-3 text-[11px] font-extrabold uppercase tracking-[0.22em] text-cream/50">Cancelled orders</h2>
          <ul className="grid gap-2 text-xs">
            {cancelled.map(o => <li key={o.id} className="flex justify-between rounded-lg border border-cream/10 bg-cream/5 px-3 py-2"><b>{o.publicId}</b><span className="text-cream/60">{o.channel} · {o.totalEgp} EGP</span></li>)}
            {!cancelled.length && <li className="text-cream/35">Clean day — zero cancels.</li>}
          </ul>
        </section>
        <section className="rounded-card border border-cream/10 bg-ink p-5">
          <h2 className="mb-3 text-[11px] font-extrabold uppercase tracking-[0.22em] text-cream/50">Complaints & breaches</h2>
          <ul className="grid gap-2 text-xs">
            {complaints.map(c => <li key={c.id} className="rounded-lg border border-red/30 bg-red/10 px-3 py-2">★{c.stars} · {c.sku} · device {c.deviceId?.slice(0, 6) ?? '—'}{c.repeat ? ' · repeat guest' : ''}</li>)}
            {breaches.map(b => <li key={b.id} className="rounded-lg border border-gold/30 bg-gold/10 px-3 py-2">SLA {(b.payload as { waitMin?: number }).waitMin ?? '?'} min · {(b.payload as { id?: string }).id}</li>)}
            {!complaints.length && !breaches.length && <li className="text-cream/35">No open exceptions.</li>}
          </ul>
        </section>
      </div>
    </div>
  )
}
