'use client'
/** Client form for /onboard/[slug] — posts to POST /api/stores/[slug]/onboard. */
import { useState } from 'react'

type P = { slug: string; nameEn: string; priceEgp: number }

export function OnboardForm({ slug, code, products }: { slug: string; code: string; products: P[] }) {
  const [invite, setInvite] = useState(code)
  const [sunThu, setSunThu] = useState('10:00 — 02:00')
  const [friSat, setFriSat] = useState('10:00 — 03:00')
  const [zones, setZones] = useState('')
  const [talabat, setTalabat] = useState('')
  const [elmenus, setElmenus] = useState('')
  const [menu, setMenu] = useState<string[]>(products.map(p => p.slug))
  const [done, setDone] = useState<null | { qrLinks: string[]; next: string[] }>(null)
  const [err, setErr] = useState('')

  async function submit(e: React.FormEvent) {
    e.preventDefault()
    setErr('')
    const r = await fetch(`/api/stores/${slug}/onboard`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        inviteCode: invite,
        hours: { sunThu, friSat },
        deliveryZones: zones.split(',').map(z => z.trim()).filter(Boolean),
        partners: { talabat, elmenus },
        menuSlugs: menu
      })
    })
    if (!r.ok) { setErr((await r.json()).error ?? 'failed'); return }
    setDone(await r.json())
  }

  if (done) {
    return (
      <div className="mt-8">
        <p className="text-lg font-black text-green">Ready for QA ✓</p>
        <p className="mt-2 text-sm text-cream/70">QR batch A links (print on sleeves & lids):</p>
        <ul className="mt-3 grid gap-1.5 text-xs text-goldlt">
          {done.qrLinks.map(q => <li key={q} className="truncate rounded-lg border border-cream/10 bg-cream/5 px-3 py-2">{q}</li>)}
        </ul>
        <p className="mt-4 text-sm text-cream/70">Next:</p>
        <ol className="mt-1 list-inside list-decimal text-xs text-cream/60">
          {done.next.map(n => <li key={n}>{n}</li>)}
        </ol>
      </div>
    )
  }

  return (
    <form onSubmit={submit} className="mt-8 grid gap-4">
      <label className="grid gap-1.5 text-xs font-extrabold uppercase tracking-[0.2em] text-cream/50">
        Invite code
        <input required value={invite} onChange={e => setInvite(e.target.value)} placeholder="NB-INV-XXXXXX"
          className="rounded-pill border border-cream/20 bg-cream/5 px-5 py-3 text-sm normal-case tracking-normal text-cream" />
      </label>
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="grid gap-1.5 text-xs font-extrabold uppercase tracking-[0.2em] text-cream/50">Hours Sun–Thu
          <input value={sunThu} onChange={e => setSunThu(e.target.value)} className="rounded-pill border border-cream/20 bg-cream/5 px-5 py-3 text-sm normal-case tracking-normal text-cream" />
        </label>
        <label className="grid gap-1.5 text-xs font-extrabold uppercase tracking-[0.2em] text-cream/50">Hours Fri–Sat
          <input value={friSat} onChange={e => setFriSat(e.target.value)} className="rounded-pill border border-cream/20 bg-cream/5 px-5 py-3 text-sm normal-case tracking-normal text-cream" />
        </label>
      </div>
      <label className="grid gap-1.5 text-xs font-extrabold uppercase tracking-[0.2em] text-cream/50">Delivery zones (comma separated)
        <input value={zones} onChange={e => setZones(e.target.value)} placeholder="El Dahar, Sakala, Marina"
          className="rounded-pill border border-cream/20 bg-cream/5 px-5 py-3 text-sm normal-case tracking-normal text-cream" />
      </label>
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="grid gap-1.5 text-xs font-extrabold uppercase tracking-[0.2em] text-cream/50">talabat store url
          <input value={talabat} onChange={e => setTalabat(e.target.value)} placeholder="https://…" className="rounded-pill border border-cream/20 bg-cream/5 px-5 py-3 text-sm normal-case tracking-normal text-cream" />
        </label>
        <label className="grid gap-1.5 text-xs font-extrabold uppercase tracking-[0.2em] text-cream/50">elmenus store url
          <input value={elmenus} onChange={e => setElmenus(e.target.value)} placeholder="https://…" className="rounded-pill border border-cream/20 bg-cream/5 px-5 py-3 text-sm normal-case tracking-normal text-cream" />
        </label>
      </div>
      <fieldset className="grid gap-2">
        <legend className="mb-2 text-xs font-extrabold uppercase tracking-[0.2em] text-cream/50">Menu at launch</legend>
        {products.map(p => (
          <label key={p.slug} className="flex items-center gap-3 text-sm text-cream/80">
            <input type="checkbox" checked={menu.includes(p.slug)} className="accent-[#E0A72C]"
              onChange={e => setMenu(m => e.target.checked ? [...m, p.slug] : m.filter(x => x !== p.slug))} />
            {p.nameEn} · {p.priceEgp} EGP
          </label>
        ))}
      </fieldset>
      {err && <p className="text-sm text-red">Error: {err}</p>}
      <button className="btn-gold mt-2" type="submit">Activate store</button>
      <p className="text-xs text-cream/45">After activation: mystery-shopper QA → head office flips live → orders start flowing to your KDS.</p>
    </form>
  )
}
