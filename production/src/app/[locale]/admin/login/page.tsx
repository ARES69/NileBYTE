'use client'
/** /admin/login — staff web login (sets httpOnly cookie via /api/auth/login). */
import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function AdminLogin() {
  const r = useRouter()
  const [v, setV] = useState({ email: '', password: '' })
  const [err, setErr] = useState('')
  async function go(e: React.FormEvent) {
    e.preventDefault()
    const res = await fetch('/api/auth/login', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(v) })
    if (!res.ok) { setErr('Bad credentials'); return }
    const j = await res.json()
    if (j.role === 'kitchen') { setErr('Kitchen accounts use /kds screens'); return }
    r.push('/admin')
  }
  return (
    <main className="grid min-h-svh place-items-center bg-black p-6">
      <form onSubmit={go} className="w-full max-w-sm rounded-card border border-cream/10 bg-ink p-8 text-center">
        <p className="eyebrow justify-center">STAFF AREA</p>
        <h1 className="display text-4xl text-cream">NILE <span className="text-gold">ADMIN</span></h1>
        <input className="mt-6 w-full rounded-pill border border-cream/20 bg-cream/5 px-5 py-3 text-cream" placeholder="you@nilebites.com" value={v.email} onChange={e => setV({ ...v, email: e.target.value })} />
        <input type="password" className="mt-3 w-full rounded-pill border border-cream/20 bg-cream/5 px-5 py-3 text-cream" placeholder="••••••" value={v.password} onChange={e => setV({ ...v, password: e.target.value })} />
        {err && <p className="mt-3 text-sm text-red">{err}</p>}
        <button className="btn-gold mt-5 w-full">Enter</button>
      </form>
    </main>
  )
}
