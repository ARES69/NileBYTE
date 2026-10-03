import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { LeadStage } from '@prisma/client'
import { getSession, requireRole } from '@/lib/auth'
import { emit } from '@/lib/events'

/** PATCH /api/leads/[id] — admin moves a franchise lead through the pipeline. */
export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  requireRole(await getSession(req), 'admin')
  const { id } = await params
  const { stage } = await req.json().catch(() => ({}))
  if (!Object.values(LeadStage).includes(stage)) return NextResponse.json({ error: 'bad-stage' }, { status: 400 })
  const lead = await prisma.franchiseLead.update({ where: { id }, data: { stage } })
  await emit(null, 'lead_stage', { id: lead.id, name: lead.name, stage })
  return NextResponse.json({ id: lead.id, stage: lead.stage })
}
