import { jwtVerify, SignJWT } from 'jose'
import { PrismaClient } from '@prisma/client'

/**
 * Nile Bites — auth & tenancy.
 * Roles: admin (head office, storeId=null) | manager (store P&L) | kitchen (KDS only).
 * Tokens: HS256 JWT in Authorization: Bearer (staff apps / KDS screens) or httpOnly cookie (web admin).
 * Tenancy rule: EVERY store-scoped query must pass through scopeStore() — no raw storeId from client.
 */
const prisma = new PrismaClient()
const SECRET = new TextEncoder().encode(process.env.AUTH_SECRET ?? 'dev-secret-change-me')

export type Role = 'admin' | 'manager' | 'kitchen'
export type Session = { sub: string; email: string; role: Role; storeId: string | null }

export async function signToken(s: Omit<Session, 'sub'> & { sub: string }) {
  return new SignJWT({ email: s.email, role: s.role, storeId: s.storeId })
    .setProtectedHeader({ alg: 'HS256' })
    .setSubject(s.sub)
    .setIssuedAt()
    .setExpirationTime('12h')
    .sign(SECRET)
}

export async function getSession(req: Request): Promise<Session | null> {
  const header = req.headers.get('authorization') ?? ''
  const token = header.startsWith('Bearer ') ? header.slice(7) : null
  if (!token) return null
  try {
    const { payload } = await jwtVerify(token, SECRET)
    return {
      sub: payload.sub as string,
      email: payload.email as string,
      role: payload.role as Role,
      storeId: (payload.storeId as string) ?? null
    }
  } catch {
    return null
  }
}

export function requireRole(s: Session | null, ...roles: Role[]): Session {
  if (!s || !roles.includes(s.role)) throw new Error('forbidden')
  return s
}

/**
 * Tenancy guard: returns the storeId the session may act on.
 * admin may pass ?storeId=…, staff are pinned to their own store.
 */
export function scopeStore(s: Session, requestedStoreId?: string | null): string {
  if (s.role === 'admin') {
    if (!requestedStoreId) throw new Error('storeId required for admin')
    return requestedStoreId
  }
  if (!s.storeId) throw new Error('staff without store')
  if (requestedStoreId && requestedStoreId !== s.storeId) throw new Error('forbidden: cross-store')
  return s.storeId
}

export async function verifyStaff(email: string, password: string) {
  const staff = await prisma.staff.findUnique({ where: { email } })
  if (!staff) return null
  const bcrypt = await import('bcryptjs')
  const ok = await bcrypt.default.compare(password, staff.passwordHash)
  return ok ? staff : null
}
