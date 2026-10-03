'use client'
/** Live ops feed for admin: SSE from /api/kds/stream (admin may pass storeId). */
import { useEffect, useRef, useState } from 'react'

type Ev = { id: string; type: string; at: string; text: string }

export function LiveFeed() {
  const [storeId, setStoreId] = useState('')
  const [events, setEvents] = useState<Ev[]>([])
  const [on, setOn] = useState(false)
  const es = useRef<EventSource | null>(null)

  useEffect(() => {
    if (!on || !storeId) return
    const src = new EventSource(`/api/kds/stream?storeId=${storeId}`) // cookie auth
    const push = (type: string) => (e: MessageEvent) => {
      const d = JSON.parse(e.data)
      setEvents(ev => [{ id: d.id ?? type, type, at: new Date().toLocaleTimeString('en-GB').slice(0, 5), text: describe(type, d) }, ...ev].slice(0, 30))
    }
    ;['order_new', 'order_status', 'order_paid', 'order_cancel', 'sla_breach', 'store_live', 'points_earned'].forEach(t => src.addEventListener(t, push(t) as EventListener))
    es.current = src
    return () => src.close()
  }, [on, storeId])

  function describe(t: string, d: Record<string, unknown>): string {
    switch (t) {
      case 'order_new': return `${d.id} new · ${d.items}`
      case 'order_status': return `${d.id} → ${d.to}`
      case 'order_paid': return `${d.id} paid ${d.total} EGP`
      case 'order_cancel': return `${d.id} cancelled: ${d.why}`
      case 'sla_breach': return `${d.id} SLA ${d.waitMin} min!`
      case 'store_live': return `store ${d.stage}`
      case 'points_earned': return `${d.publicId} points intent`
      default: return t
    }
  }

  return (
    <section className="rounded-card border border-cream/10 bg-ink p-5">
      <div className="mb-3 flex items-center gap-3">
        <h2 className="text-[11px] font-extrabold uppercase tracking-[0.22em] text-cream/50">Live ops feed</h2>
        <input className="ml-auto w-40 rounded-pill border border-cream/20 bg-cream/5 px-3 py-1.5 text-xs text-cream" placeholder="storeId (cuid)" value={storeId} onChange={e => setStoreId(e.target.value.trim())} />
        <button className="btn-gold !px-4 !py-1.5 !text-[10px]" onClick={() => setOn(v => !v)}>{on ? 'Stop' : 'Stream'}</button>
      </div>
      <ul className="grid max-h-64 gap-1.5 overflow-y-auto text-xs">
        {events.map((e, i) => (
          <li key={i} className="flex gap-2 rounded-lg border border-cream/10 bg-cream/5 px-3 py-2">
            <span className="text-cream/40">{e.at}</span>
            <span className={e.type.includes('breach') || e.type.includes('cancel') ? 'text-red' : e.type.includes('paid') ? 'text-green' : 'text-cream/80'}>{e.text}</span>
          </li>
        ))}
        {!events.length && <li className="text-cream/35">Press Stream — events arrive from Outbox (orders, payments, SLA, onboarding).</li>}
      </ul>
    </section>
  )
}
