'use client'
/** Admin: create store + invite (onboarding step 1) — POST /api/stores. */
import { useState } from 'react'

export function CreateStore() {
  const [open, setOpen] = useState(false)
  const [f, setF] = useState({ slug: '', city: '', cityAr: '', address: '', addressAr: '', lat: '', lng: '', phone: '' })
  const [res, setRes] = useState<null | { inviteCode: string; inviteUrl: string }>(null)
  const set = (k: string) => (e: React.ChangeEvent<HTMLInputElement>) => setF({ ...f, [k]: e.target.value })

  async function go(e: React.FormEvent) {
    e.preventDefault()
    const r = await fetch('/api/stores', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...f, lat: parseFloat(f.lat) || 0, lng: parseFloat(f.lng) || 0 })
    })
    if (!r.ok) { alert((await r.json()).error ?? 'failed'); return }
    setRes(await r.json()); setOpen(false)
  }

  return (
    <section className="rounded-card border border-cream/10 bg-ink p-5">
      <div className="flex flex-wrap items-center gap-3">
        <h2 className="text-[11px] font-extrabold uppercase tracking-[0.22em] text-cream/50">Connect a restaurant</h2>
        <button className="btn-gold ml-auto !px-4 !py-2 !text-[10px]" onClick={() => setOpen(v => !v)}>{open ? 'Close' : '+ New store + invite'}</button>
      </div>
      {res && (
        <p className="mt-3 rounded-xl border border-emerald-300/40 bg-emerald-300/10 px-4 py-3 text-xs text-emerald-200">
          Invite created: <b>{res.inviteCode}</b> — send this link to the partner: <span className="text-cream">{res.inviteUrl}</span>
        </p>
      )}
      {open && (
        <form onSubmit={go} className="mt-4 grid gap-3 sm:grid-cols-2">
          {(['slug', 'city', 'cityAr', 'address', 'addressAr', 'lat', 'lng', 'phone'] as const).map(k => (
            <input key={k} required={k !== 'cityAr' && k !== 'addressAr'} placeholder={k} value={f[k]} onChange={set(k)}
              className="rounded-pill border border-cream/20 bg-cream/5 px-4 py-2.5 text-sm text-cream" />
          ))}
          <button className="btn-gold sm:col-span-2">Create store + invite (14 days)</button>
        </form>
      )}
    </section>
  )
}
