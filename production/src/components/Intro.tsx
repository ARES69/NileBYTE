'use client'
/**
 * Intro «THE NILE» — gold dot → Nile line → crocodile → NILE BITES → tagline.
 * Spec: SPEC.md §3 (timings), src/lib/motion.ts (tokens).
 * Skips: click/Esc/Enter, sessionStorage seen-flag, prefers-reduced-motion.
 */
import { useEffect, useState } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import { introTimeline, EASE } from '@/lib/motion'

export function Intro() {
  const reduce = useReducedMotion()
  const [done, setDone] = useState(false)
  const [seen, setSeen] = useState(true) // SSR-safe: assume seen, flip in effect

  useEffect(() => {
    setSeen(sessionStorage.getItem('nb-intro') === '1')
  }, [])
  useEffect(() => {
    if (reduce || seen || done) return
    const t = setTimeout(() => finish(), (introTimeline.exit.delay + 0.2) * 1000)
    const key = (e: KeyboardEvent) => { if (e.key === 'Escape' || e.key === 'Enter') finish() }
    window.addEventListener('keydown', key)
    window.addEventListener('click', finish, { once: true })
    return () => { clearTimeout(t); window.removeEventListener('keydown', key); window.removeEventListener('click', finish) }
  }, [reduce, seen, done])

  function finish() {
    setDone(true)
    sessionStorage.setItem('nb-intro', '1')
  }
  if (reduce || seen || done) return null

  return (
    <div className="fixed inset-0 z-[300] grid place-items-center bg-black" onClick={finish} role="presentation">
      <svg viewBox="0 0 1200 420" className="w-[min(1000px,92vw)]">
        <defs>
          <linearGradient id="nileGrad" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#E0A72C" stopOpacity="0" />
            <stop offset="35%" stopColor="#F2CE72" />
            <stop offset="100%" stopColor="#C9713A" />
          </linearGradient>
        </defs>
        <motion.circle cx={60} cy={300} r={5} fill="#E0A72C"
          initial={{ opacity: 0, scale: 0.4 }}
          animate={{ opacity: [0, 1, 1, 0], scale: [0.4, 1.8, 0.9, 0.6] }}
          transition={{ duration: introTimeline.dot.duration, ease: EASE.base }} />
        <motion.path d="M60,300 C230,296 300,190 470,196 C640,202 700,306 880,292 C1000,283 1060,214 1150,206"
          fill="none" stroke="url(#nileGrad)" strokeWidth={5} strokeLinecap="round"
          initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
          transition={{ duration: introTimeline.line.duration, delay: introTimeline.line.delay, ease: EASE.base }} />
        <motion.g initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }}
          transition={{ duration: introTimeline.croc.duration, delay: introTimeline.croc.delay, ease: EASE.out }}>
          <path d="M700,206 q10,-14 22,-15 q14,-1 18,10 l34,1 q6,0 8,5 q-3,4 -8,4 l-32,0 q-6,12 -20,12 q-12,0 -18,-9 q-2,-4 -4,-8 z"
            fill="#0B0906" stroke="#E0A72C" strokeWidth={1.6} />
          <circle cx={736} cy={199} r={1.8} fill="#E0A72C" />
        </motion.g>
      </svg>
      <div className="pointer-events-none absolute inset-x-0 top-[58%] text-center">
        <p className="font-display text-[clamp(38px,9vw,120px)] leading-none text-cream">
          {'NILE BITES'.split('').map((ch, i) => (
            <motion.span key={i} className="inline-block" initial={{ opacity: 0, y: 28, rotate: 4 }}
              animate={{ opacity: 1, y: 0, rotate: 0 }}
              transition={introTimeline.letter(i)}>{ch === ' ' ? '\u00A0' : ch}</motion.span>
          ))}
        </p>
        <motion.p initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
          transition={{ delay: introTimeline.tag.delay, duration: introTimeline.tag.duration, ease: EASE.base }}
          className="mt-4 text-xs font-extrabold uppercase tracking-[0.42em] text-gold">TASTE THE NILE.</motion.p>
      </div>
      <button className="absolute bottom-7 right-7 rounded-pill border border-cream/25 px-4 py-2 text-[11px] tracking-[0.2em] text-muted" onClick={finish}>SKIP</button>
    </div>
  )
}
