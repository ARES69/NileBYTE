import Link from 'next/link'

/** Admin shell: sidebar nav + role badge. Guarded by middleware (JWT cookie). */
export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  // middleware already guards /admin/*; here we only decorate authenticated shells
  const s = await getSessionFromCookie()
  if (!s) return <>{children}</>
  const nav = [
    ['/admin', 'Sales'], ['/admin/orders', 'Orders'], ['/admin/risk', 'Risk'],
    ['/admin/stores', 'Stores'], ['/admin/leads', 'Franchise'], ['/admin/club', 'Club & CRM'], ['/kds', 'Kitchen (KDS)']
  ]
  return (
    <div className="grid min-h-svh bg-black text-cream md:grid-cols-[230px_1fr]">
      <aside className="border-b border-cream/10 p-4 md:border-b-0 md:border-r">
        <p className="px-2 pb-4 font-display text-lg tracking-widest">NILE <span className="text-gold">ADMIN</span> <span className="ml-1 rounded-pill border border-gold/40 px-2 py-0.5 text-[9px] text-gold">v2</span></p>
        <nav className="flex gap-1 overflow-x-auto md:flex-col">
          {nav.map(([href, label]) => (
            <Link key={href} href={href} className="whitespace-nowrap rounded-xl px-3 py-2.5 text-sm font-bold text-cream/60 hover:bg-cream/5 hover:text-cream">{label}</Link>
          ))}
        </nav>
        <p className="mt-6 hidden px-2 text-[11px] text-cream/40 md:block">
          {s.email} · <span className="text-gold">{s.role}</span>{s.storeId ? ' · pinned store' : ' · head office'}
          <br />data: Prisma + Outbox (live)
        </p>
      </aside>
      <main className="min-w-0 p-5 md:p-7">{children}</main>
    </div>
  )
}

async function getSessionFromCookie() {
  // cookie-based session for web admin (middleware already verified; re-read for UI)
  const { cookies } = await import('next/headers')
  const raw = (await cookies()).get('nb-token')?.value
  if (!raw) return null
  return getSessionFromToken(raw)
}
async function getSessionFromToken(token: string) {
  const { jwtVerify } = await import('jose')
  try {
    const { payload } = await jwtVerify(token, new TextEncoder().encode(process.env.AUTH_SECRET ?? 'dev-secret-change-me'))
    return { email: payload.email as string, role: payload.role as string, storeId: (payload.storeId as string) ?? null }
  } catch { return null }
}
