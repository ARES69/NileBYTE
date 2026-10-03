import { prisma } from '@/lib/db'

/** /admin/orders — real orders table with status chips; ?status= & ?q= filters via search params. */
export const dynamic = 'force-dynamic'
const ST: Record<string, string> = {
  NEW: 'text-goldlt border-gold/40', PREP: 'text-sky-300 border-sky-300/40', READY: 'text-emerald-300 border-emerald-300/40',
  DONE: 'text-cream/50 border-cream/20', CANCELLED: 'text-red border-red/40'
}

export default async function AdminOrders({ searchParams }: { searchParams: Promise<{ status?: string; q?: string }> }) {
  const { status, q } = await searchParams
  const orders = await prisma.order.findMany({
    where: {
      ...(status ? { status: status as never } : {}),
      ...(q ? { OR: [{ publicId: { contains: q, mode: 'insensitive' } }, { phone: { contains: q } }, { name: { contains: q, mode: 'insensitive' } }] } : {})
    },
    orderBy: { createdAt: 'desc' }, take: 80, include: { store: { select: { city: true } } }
  })
  const filters = ['NEW', 'PREP', 'READY', 'DONE', 'CANCELLED']
  return (
    <div className="grid gap-5">
      <h1 className="display text-3xl">ORDERS</h1>
      <form className="flex flex-wrap gap-2 text-xs">
        <input name="q" defaultValue={q ?? ''} placeholder="search id / phone / name" className="rounded-pill border border-cream/20 bg-cream/5 px-4 py-2 text-cream" />
        {filters.map(f => (
          <button key={f} name="status" value={f} className={`rounded-pill border px-4 py-2 font-extrabold uppercase tracking-widest ${status === f ? 'border-gold bg-gold text-black' : 'border-cream/20 text-cream/60 hover:border-cream/50'}`}>{f}</button>
        ))}
      </form>
      <div className="overflow-x-auto rounded-card border border-cream/10 bg-ink">
        <table className="w-full text-sm">
          <thead><tr className="text-left text-[10px] uppercase tracking-[0.18em] text-cream/40">
            <th className="p-3">Order</th><th className="p-3">Store</th><th className="p-3">Items</th><th className="p-3">Channel</th><th className="p-3">Total</th><th className="p-3">Status</th><th className="p-3">Created</th>
          </tr></thead>
          <tbody>
            {orders.map(o => (
              <tr key={o.id} className="border-t border-cream/10 hover:bg-cream/5">
                <td className="p-3 font-black">{o.publicId}</td>
                <td className="p-3 text-cream/60">{o.store?.city ?? '—'}</td>
                <td className="max-w-xs truncate p-3 text-cream/70">{JSON.stringify(o.items)}</td>
                <td className="p-3 text-cream/60">{o.channel}</td>
                <td className="p-3 font-bold text-goldlt">{o.totalEgp} EGP</td>
                <td className="p-3"><span className={`rounded-pill border px-3 py-1 text-[10px] font-black uppercase tracking-widest ${ST[o.status]}`}>{o.status}</span></td>
                <td className="p-3 text-cream/50">{new Date(o.createdAt).toLocaleTimeString('en-GB').slice(0, 5)}</td>
              </tr>
            ))}
            {!orders.length && <tr><td colSpan={7} className="p-6 text-center text-cream/40">No orders match.</td></tr>}
          </tbody>
        </table>
      </div>
    </div>
  )
}
