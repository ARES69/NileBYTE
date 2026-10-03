import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

/** GET /api/health — uptime probe: DB round-trip + version. Used by uptime monitor & CI smoke. */
export const dynamic = 'force-dynamic'

export async function GET() {
  const t0 = Date.now()
  try {
    await prisma.$queryRaw`SELECT 1`
    return NextResponse.json({ ok: true, dbMs: Date.now() - t0, v: process.env.npm_package_version ?? '0.1.0' })
  } catch (e) {
    return NextResponse.json({ ok: false, error: 'db-unreachable' }, { status: 503 })
  }
}
