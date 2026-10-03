import { NextResponse } from 'next/server'
import { verifyStaff, signToken } from '@/lib/auth'

/**
 * POST /api/auth/login — staff auth (admin web, KDS screens, store manager app).
 * Body: { email, password }
 * KDS screens use ?long=1 for a 30-day token (device-pinned in practice).
 */
export async function POST(req: Request) {
  const { email, password } = await req.json().catch(() => ({}))
  if (typeof email !== 'string' || typeof password !== 'string') {
    return NextResponse.json({ error: 'invalid' }, { status: 400 })
  }
  const staff = await verifyStaff(email, password)
  if (!staff) return NextResponse.json({ error: 'bad-credentials' }, { status: 401 })

  const url = new URL(req.url)
  const long = url.searchParams.get('long') === '1'
  const token = await signToken({ sub: staff.id, email: staff.email, role: staff.role as 'admin' | 'manager' | 'kitchen', storeId: staff.storeId })
  const res = NextResponse.json({ token, role: staff.role, storeId: staff.storeId, expires: long ? '30d (device)' : '12h' })
  res.cookies.set('nb-token', token, {
    httpOnly: true, sameSite: 'lax', secure: process.env.NODE_ENV === 'production',
    path: '/', maxAge: long ? 60 * 60 * 24 * 30 : 60 * 60 * 12
  })
  return res
}
