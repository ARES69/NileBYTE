import { prisma } from '@/lib/db'
import { StageSelect } from './stage'

/** /admin/leads — franchise pipeline from real DB (site form → FranchiseLead). */
export const dynamic = 'force-dynamic'
const STAGE_STYLE: Record<string, string> = {
  NEW: 'border-cream/25 text-cream/70', QUALIFIED: 'border-gold/50 text-goldlt', CALL_BOOKED: 'border-sky-300/50 text-sky-300',
  DECK_SENT: 'border-terra/60 text-terralt', DISCOVERY: 'border-emerald-300/50 text-emerald-300', PAUSED: 'border-red/40 text-red'
}

export default async function AdminLeads() {
  const leads = await prisma.franchiseLead.findMany({ orderBy: { createdAt: 'desc' } })
  const decks = await prisma.deckDownload.count()
  const byStage = (st: string) => leads.filter(l => l.stage === st).length
  return (
    <div className="grid gap-5">
      <h1 className="display text-3xl">FRANCHISE PIPELINE</h1>
      <div className="grid gap-3 sm:grid-cols-5">
        {['NEW', 'QUALIFIED', 'CALL_BOOKED', 'DECK_SENT', 'DISCOVERY'].map(st => (
          <div key={st} className="rounded-card border border-cream/10 bg-ink p-4">
            <p className="text-[10px] font-extrabold uppercase tracking-[0.18em] text-cream/50">{st.replace('_', ' ')}</p>
            <p className="mt-1 font-display text-3xl text-cream">{byStage(st)}</p>
          </div>
        ))}
      </div>
      <div className="overflow-x-auto rounded-card border border-cream/10 bg-ink">
        <table className="w-full text-sm">
          <thead><tr className="text-left text-[10px] uppercase tracking-[0.18em] text-cream/40">
            <th className="p-3">Name</th><th className="p-3">City</th><th className="p-3">Budget</th><th className="p-3">Stage</th><th className="p-3">Source</th><th className="p-3">Date</th>
          </tr></thead>
          <tbody>
            {leads.map(l => (
              <tr key={l.id} className="border-t border-cream/10 hover:bg-cream/5">
                <td className="p-3 font-black">{l.name}<div className="text-[11px] font-normal text-cream/45">{l.email}</div></td>
                <td className="p-3 text-cream/70">{l.city}</td>
                <td className="p-3 text-cream/70">{l.budget}</td>
                <td className="p-3"><span className={`inline-block rounded-pill border px-3 py-1 text-[10px] font-black uppercase tracking-widest ${STAGE_STYLE[l.stage]}`}><StageSelect id={l.id} stage={l.stage} /></span></td>
                <td className="p-3 text-cream/50">{l.source}</td>
                <td className="p-3 text-cream/50">{l.createdAt.toISOString().slice(5, 10)}</td>
              </tr>
            ))}
            {!leads.length && <tr><td colSpan={6} className="p-6 text-center text-cream/40">No leads yet — site form feeds this table.</td></tr>}
          </tbody>
        </table>
      </div>
      <p className="text-xs text-cream/40">Deck downloads: {decks} · SLA: first response &lt; 24 h · deck disclosed after qualification (NDA).</p>
    </div>
  )
}
