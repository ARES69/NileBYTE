import createMiddleware from 'next-intl/middleware'
import { NextResponse, type NextRequest } from 'next/server'
import { jwtVerify } from 'jose'
import { routing } from '@/i18n/routing'

const i18n = createMiddleware(routing)

const SECRET = new TextEncoder().encode(process.env.AUTH_SECRET ?? 'dev-secret-change-me')

/** /admin/* (except login) requires a valid staff JWT in cookie or Bearer. */
export default async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl
  if (pathname.startsWith('/admin') && !pathname.startsWith('/admin/login')) {
    const raw = req.cookies.get('nb-token')?.value ?? req.headers.get('authorization')?.replace('Bearer ', '')
    let ok = false
    if (raw) {
      try {
        const { payload } = await jwtVerify(raw, SECRET)
        ok = payload.role === 'admin' || payload.role === 'manager'
      } catch { ok = false }
    }
    if (!ok) return NextResponse.redirect(new URL('/admin/login', req.url))
  }
  return i18n(req)
}

export const config = {
  // i18n only for page routes; api/assets/metadata stay locale-free
  matcher: ['/((?!api|_next|_vercel|icons|img|fonts|manifest\\.webmanifest|robots\\.txt|sitemap\\.xml|opengraph-image|.*\\..*).*)']
}
