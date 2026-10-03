import { NextResponse } from 'next/server'
import { preflight, jres } from '@/lib/cors'
import { PrismaClient } from '@prisma/client'
import { z } from 'zod'

const prisma = new PrismaClient()

const LeadSchema = z.object({
  name: z.string().min(2),
  city: z.string().min(2),
  email: z.string().email(),
  budget: z.string().optional(),
  message: z.string().optional()
})

/** POST /api/lead — franchise form (SPEC §5.12). SLA: first response < 24 h. */
export function OPTIONS() { return preflight() }

export async function POST(req: Request) {
  const parsed = LeadSchema.safeParse(await req.json().catch(() => null))
  if (!parsed.success) return jres({ error: 'invalid' }, 400)
  const d = parsed.data
  const lead = await prisma.franchiseLead.upsert({
    where: { email: d.email },
    update: { city: d.city, name: d.name, budget: d.budget ?? '—', message: d.message },
    create: { name: d.name, city: d.city, email: d.email, budget: d.budget ?? '—', message: d.message }
  })
  // TODO: notify franchise@ + CRM webhook; schedule SLA reminder (24 h)
  return jres({ id: lead.id })
}
