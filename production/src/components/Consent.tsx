'use client'
/**
 * Consent banner — SPEC §13.7: necessary / marketing / analytics granularity,
 * persisted (cookie nb-consent), logged to ConsentLog via /api/consent (TODO),
 * reopen from footer "Cookie settings".
 */
import { useEffect, useState } from 'react'

type Pref = { nec: 1; mkt: 0 | 1; ana: 0 | 1 }

export function Consent() {
  const [show, setShow] = useState(false)
  const [prefs, setPrefs] = useState(false)
  const [mkt, setMkt] = useState(true)
  const [ana, setAna] = useState(true)

  useEffect(() => {
    if (!document.cookie.includes('nb-consent')) setTimeout(() => setShow(true), 2500)
  }, [])

  function save(p: Pref) {
    document.cookie = `nb-consent=${JSON.stringify(p)};path=/;max-age=31536000;SameSite=Lax`
    // TODO: POST /api/consent (ConsentLog) and gate GA4/Matomo loaders by p.ana/p.mkt
    setShow(false); setPrefs(false)
  }

  if (!show) return null
  return (
    <div role="dialog" aria-label="Cookie preferences"
      className="fixed bottom-4 left-1/2 z-[150] w-[min(560px,calc(100vw-24px))] -translate-x-1/2 rounded-card border border-cream/15 bg-ink p-5 text-cream shadow-[0_30px_70px_rgba(0,0,0,0.5)]">
      <p className="mb-4 text-[13px] text-muted">
        We use cookies and QR scan analytics to make the Nile tastier. No spam, never sold — see Privacy.
      </p>
      {prefs && (
        <div className="mb-4 grid gap-3">
          <label className="flex items-center gap-2.5 text-[13px] font-bold"><input type="checkbox" checked disabled /> Necessary — always on</label>
          <label className="flex items-center gap-2.5 text-[13px] font-bold"><input type="checkbox" checked={mkt} onChange={e => setMkt(e.target.checked)} /> Marketing — ads & social pixels</label>
          <label className="flex items-center gap-2.5 text-[13px] font-bold"><input type="checkbox" checked={ana} onChange={e => setAna(e.target.checked)} /> Analytics — GA4 / Matomo + scan CRM</label>
        </div>
      )}
      <div className="flex flex-wrap gap-2.5">
        <button className="btn-gold !px-5 !py-3 !text-[11px]" onClick={() => prefs ? save({ nec: 1, mkt: mkt ? 1 : 0, ana: ana ? 1 : 0 }) : save({ nec: 1, mkt: 1, ana: 1 })}>Accept all</button>
        <button className="btn-line-light !px-5 !py-3 !text-[11px]" onClick={() => save({ nec: 1, mkt: 0, ana: 0 })}>Necessary only</button>
        <button className="btn-line-light !px-5 !py-3 !text-[11px]" onClick={() => setPrefs(v => !v)}>Preferences</button>
      </div>
    </div>
  )
}
