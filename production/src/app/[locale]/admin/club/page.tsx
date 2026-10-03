import { prisma } from '@/lib/db'

/** /admin/club — Nile Club & scan-CRM from real data: members, points, QR funnel, referrals, repeat. */
export const dynamic = 'force-dynamic'

export default async function AdminClub() {
  const [members, scans, rated, repeats, refs, ledger] = await Promise.all([
    prisma.clubMember.findMany({ orderBy: { points: 'desc' }, take: 12, include: { _count: { select: { ledger: true } } } }),
    prisma.scan.count(),
    prisma.scan.count({ where: { stars: { not: null } } }),
    prisma.scan.count({ where: { repeat: true } }),
    prisma.referral.count({ where: { status: 'converted' } }),
    prisma.pointLedger.aggregate({ _sum: { delta: true } })
  ])
  const funnel = [
    { t: 'Cups scanned', v: scans },
    { t: 'Rated their bite', v: rated },
    { t: 'Joined Nile Club', v: members.length },
    { t: 'Referred a buddy', v: refs }
  ]
  const max = Math.max(1, ...funnel.map(f => f.v))
  const card = (t: string, v: string, note: string) => (
    <div className="rounded-card border border-cream/10 bg-ink p-4">
      <p className="text-[10px] font-extrabold uppercase tracking-[0.2em] text-cream/50">{t}</p>
      <p className="mt-2 font-display text-3xl text-goldlt">{v}</p>
      <p className="mt-1 text-[11px] text-cream/50">{note}</p>
    </div>
  )
  return (
    <div className="grid gap-5">
      <h1 className="display text-3xl">NILE CLUB · SCAN CRM</h1>
      <div className="grid gap-3 sm:grid-cols-4">
        {card('Members', members.length.toLocaleString('en-US'), 'phone-OTP onboarded')}
        {card('Points in circulation', (ledger._sum.delta ?? 0).toLocaleString('en-US'), 'ledger append-only')}
        {card('Repeat rate', scans ? Math.round((repeats / scans) * 100) + '%' : '—', 'device-hash repeats')}
        {card('Referrals converted', String(refs), 'buddy → free sauce, referrer +50')}
      </div>
      <div className="grid gap-5 lg:grid-cols-[1fr_1.2fr]">
        <section className="rounded-card border border-cream/10 bg-ink p-5">
          <h2 className="mb-4 text-[11px] font-extrabold uppercase tracking-[0.22em] text-cream/50">QR funnel</h2>
          <div className="grid gap-2">
            {funnel.map(f => (
              <div key={f.t}>
                <div className="mb-1 flex justify-between text-xs"><span className="text-cream/70">{f.t}</span><b className="text-cream">{f.v}</b></div>
                <div className="h-2.5 overflow-hidden rounded-pill bg-cream/10"><div className="h-full rounded-pill bg-gold" style={{ width: `${(f.v / max) * 100}%` }} /></div>
              </div>
            ))}
          </div>
        </section>
        <section className="rounded-card border border-cream/10 bg-ink p-5">
          <h2 className="mb-3 text-[11px] font-extrabold uppercase tracking-[0.22em] text-cream/50">Top members</h2>
          <table className="w-full text-sm">
            <thead><tr className="text-left text-[10px] uppercase tracking-[0.18em] text-cream/40"><th className="p-2">Member</th><th className="p-2">Tier</th><th className="p-2">Points</th><th className="p-2">Ops</th></tr></thead>
            <tbody>
              {members.map(m => (
                <tr key={m.id} className="border-t border-cream/10">
                  <td className="p-2 font-bold">{m.publicId}<div className="text-[11px] font-normal text-cream/45">{m.phone.slice(0, 6)}••</div></td>
                  <td className="p-2 text-cream/60">{m.tier}</td>
                  <td className="p-2 text-goldlt">{m.points}</td>
                  <td className="p-2 text-cream/50">{m._count.ledger}</td>
                </tr>
              ))}
              {!members.length && <tr><td colSpan={4} className="p-4 text-center text-cream/40">No members yet — JOIN flow on site feeds this.</td></tr>}
            </tbody>
          </table>
        </section>
      </div>
    </div>
  )
}
