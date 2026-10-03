'use client'
/** Inline stage select for franchise leads — PATCH /api/leads/[id]. */
import { useTransition } from 'react'

const STAGES = ['NEW', 'QUALIFIED', 'CALL_BOOKED', 'DECK_SENT', 'DISCOVERY', 'PAUSED']

export function StageSelect({ id, stage }: { id: string; stage: string }) {
  const [, start] = useTransition()
  return (
    <select
      defaultValue={stage}
      className="cursor-pointer border-0 bg-transparent p-0 text-[10px] font-black uppercase tracking-widest inherit focus:outline-none"
      onChange={e => {
        start(async () => {
          await fetch(`/api/leads/${id}`, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ stage: e.target.value }) })
        })
      }}
    >
      {STAGES.map(s => <option key={s} value={s} className="bg-black text-cream">{s.replace('_', ' ')}</option>)}
    </select>
  )
}
