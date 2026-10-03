'use client'
/**
 * /kds — Kitchen Display Screen (full-screen, touch).
 * Connects to /api/kds/stream (SSE) with a long-lived kitchen token.
 * Columns NEW → PREPARING → READY; live timers; >12 min = breach (red pulse).
 * Actions: BUMP (NEW→PREP), FIRE (PREP→READY) via PATCH /api/orders/[id]/status.
 */
import { useEffect, useMemo, useRef, useState } from 'react'

type Ticket = { id: string; ts: number; items: string; ch: string; total: number; st: 'NEW' | 'PREP' | 'READY' }

const COLS: { key: Ticket['st']; label: string; action?: string; next?: Ticket['st'] }[] = [
  { key: 'NEW', label: 'NEW', action: 'BUMP → COOKING', next: 'PREP' },
  { key: 'PREP', label: 'COOKING', action: 'FIRE → COUNTER', next: 'READY' },
  { key: 'READY', label: 'READY', action: undefined }
]

export default function KdsPage() {
  const [token, setToken] = useState<string | null>(null)
  const [storeId, setStoreId] = useState<string | null>(null)
  const [login, setLogin] = useState({ email: '', password: '' })
  const [err, setErr] = useState('')
  const [tickets, setTickets] = useState<Ticket[]>([])
  const [, force] = useState(0) // timer tick
  const esRef = useRef<EventSource | null>(null)

  useEffect(() => {
    const t = localStorage.getItem('nb-kds-token')
    const s = localStorage.getItem('nb-kds-store')
    if (t && s) { setToken(t); setStoreId(s) }
  }, [])
  useEffect(() => { const i = setInterval(() => force(x => x + 1), 1000); return () => clearInterval(i) }, [])

  useEffect(() => {
    if (!token || !storeId) return
    const es = new EventSource(`/api/kds/stream?storeId=${storeId}&token=${encodeURIComponent(token)}`)
    es.addEventListener('order_new', e => {
      const d = JSON.parse(e.data)
      setTickets(ts => [...ts, { id: d.id, ts: d.ts ?? Date.now(), items: d.items, ch: d.ch, total: d.total, st: 'NEW' }])
    })
    es.addEventListener('order_status', e => {
      const d = JSON.parse(e.data)
      setTickets(ts => d.to === 'DONE' || d.to === 'CANCELLED'
        ? ts.filter(t => t.id !== d.id)
        : ts.map(t => (t.id === d.id ? { ...t, st: d.to === 'PREP' ? 'PREP' : d.to === 'READY' ? 'READY' : t.st } : t)))
    })
    es.addEventListener('order_paid', e => { /* flash paid badge if needed */ })
    esRef.current = es
    return () => es.close()
  }, [token, storeId])

  const stats = useMemo(() => {
    const now = Date.now()
    const waits = tickets.map(t => (now - t.ts) / 60000)
    return {
      queue: tickets.length,
      avg: waits.length ? waits.reduce((a, b) => a + b, 0) / waits.length : 0,
      breach: waits.filter(w => w > 12).length
    }
  }, [tickets])

  async function doLogin(e: React.FormEvent) {
    e.preventDefault()
    const r = await fetch('/api/auth/login?long=1', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(login)
    })
    if (!r.ok) { setErr('Bad credentials'); return }
    const j = await r.json()
    if (j.role !== 'kitchen' && j.role !== 'manager' && j.role !== 'admin') { setErr('Not a kitchen account'); return }
    localStorage.setItem('nb-kds-token', j.token)
    localStorage.setItem('nb-kds-store', j.storeId)
    setToken(j.token); setStoreId(j.storeId)
  }

  async function advance(t: Ticket, next: Ticket['st']) {
    await fetch(`/api/orders/${t.id}/status`, {
      method: 'PATCH', headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify({ status: next })
    })
    setTickets(ts => ts.map(x => (x.id === t.id ? { ...x, st: next } : x)))
  }

  if (!token) {
    return (
      <main className="grid min-h-svh place-items-center bg-black p-6">
        <form onSubmit={doLogin} className="card w-full max-w-sm rounded-card border border-cream/10 bg-ink p-8 text-center">
          <p className="eyebrow justify-center">KITCHEN DISPLAY</p>
          <h1 className="display text-4xl text-cream">NILE KDS</h1>
          <input className="mt-6 w-full rounded-pill border border-cream/20 bg-cream/5 px-5 py-3 text-cream" placeholder="kitchen@store" value={login.email} onChange={e => setLogin({ ...login, email: e.target.value })} />
          <input type="password" className="mt-3 w-full rounded-pill border border-cream/20 bg-cream/5 px-5 py-3 text-cream" placeholder="••••••" value={login.password} onChange={e => setLogin({ ...login, password: e.target.value })} />
          {err && <p className="mt-3 text-sm text-red">{err}</p>}
          <button className="btn-gold mt-5 w-full">Connect screen</button>
          <p className="mt-4 text-xs text-cream/50">30-day device token · SSE live stream</p>
        </form>
      </main>
    )
  }

  const now = Date.now()
  return (
    <main className="min-h-svh bg-black p-4 text-cream">
      <header className="mb-4 flex flex-wrap items-center gap-6 px-2">
        <h1 className="display text-3xl text-gold">KDS</h1>
        <span className="text-sm text-cream/60">queue <b className="text-cream">{stats.queue}</b></span>
        <span className="text-sm text-cream/60">avg <b className={stats.avg > 8 ? 'text-goldlt' : 'text-green'}>{stats.avg.toFixed(1)} min</b></span>
        <span className="text-sm text-cream/60">breach <b className={stats.breach ? 'text-red' : 'text-cream'}>{stats.breach}</b></span>
        <span className="ml-auto text-xs text-cream/40">SLA 12 min · peak 19–21h</span>
      </header>
      <div className="grid gap-4 md:grid-cols-3">
        {COLS.map(col => (
          <section key={col.key} className="rounded-card border border-cream/10 bg-ink/60 p-3">
            <h2 className="mb-3 px-1 text-xs font-extrabold uppercase tracking-[0.22em] text-cream/60">{col.label} · {tickets.filter(t => t.st === col.key).length}</h2>
            <div className="grid gap-3">
              {tickets.filter(t => t.st === col.key).sort((a, b) => a.ts - b.ts).map(t => {
                const el = (now - t.ts) / 60000
                const mm = Math.floor(el), ss = Math.floor((el - mm) * 60)
                const cls = el > 12 ? 'border-red text-red animate-pulse' : el > 8 ? 'border-gold text-goldlt' : 'border-cream/15 text-green'
                return (
                  <article key={t.id} className={`rounded-2xl border-2 bg-card2 p-4 ${cls}`}>
                    <div className="flex items-baseline gap-3">
                      <b className="text-sm font-black">{t.id}</b>
                      <span className="text-[11px] uppercase tracking-widest text-cream/50">{t.ch}</span>
                      <span className="ml-auto font-display text-2xl">{mm}:{String(ss).padStart(2, '0')}</span>
                    </div>
                    <p className="mt-2 text-xs leading-relaxed text-cream/70">{t.items}</p>
                    <p className="mt-1 text-xs text-goldlt">{t.total} EGP</p>
                    {col.action && (
                      <button onClick={() => advance(t, col.next!)} className="btn-gold mt-3 w-full !py-2 !text-[11px]">{col.action}</button>
                    )}
                  </article>
                )
              })}
              {!tickets.some(t => t.st === col.key) && <p className="px-1 text-xs text-cream/35">empty</p>}
            </div>
          </section>
        ))}
      </div>
    </main>
  )
}
