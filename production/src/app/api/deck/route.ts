import { NextResponse } from 'next/server'
import { preflight, jres } from '@/lib/cors'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

/** POST /api/deck — gated deck request: logs download, returns signed URL. */
export function OPTIONS() { return preflight() }

export async function POST(req: Request) {
  const { email } = await req.json().catch(() => ({}))
  if (typeof email !== 'string' || !/^.+@.+\..+$/.test(email)) return jres({ error: 'email' }, 400)
  await prisma.deckDownload.create({ data: { email } })
  // TODO: return time-limited signed URL to /franchise-kit deck (R2/S3), not a public link
  return jres({ ok: true })
}
