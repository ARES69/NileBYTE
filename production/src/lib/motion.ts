/**
 * Nile Bites — Framer Motion tokens.
 * Port of the concept animations (SPEC §2.3, §3, §13.6). One source of truth
 * for easings/durations across intro, reveals, marquee, builder.
 */
import type { Transition, Variants } from 'framer-motion'

export const EASE = {
  base: [0.22, 0.61, 0.36, 1] as const,
  out:  [0.16, 1, 0.3, 1] as const
}

export const T = {
  fast: 0.35,
  base: 0.55,
  slow: 0.9,
  introDot: 1.2,
  introLine: 1.9,
  introCroc: 1.1,
  introLetter: 0.7,
  introTag: 0.8
}

/** Intro «THE NILE»: dot -> line draw -> crocodile -> letters -> tagline. */
export const introTimeline = {
  dot:    { delay: 0.0,  duration: T.introDot },
  line:   { delay: 0.35, duration: T.introLine },
  croc:   { delay: 1.5,  duration: T.introCroc },
  letter: (i: number) => ({ delay: 2.05 + i * 0.07, duration: T.introLetter }),
  tag:    { delay: 3.0,  duration: T.introTag },
  exit:   { delay: 4.3,  duration: 0.8 }
}

export const lineDraw = (length: number) => ({
  initial: { pathLength: 0, opacity: 0 },
  animate: { pathLength: 1, opacity: 1 },
  transition: { duration: T.introLine, ease: EASE.base, delay: introTimeline.line.delay }
})

export const heroLine: Variants = {
  hidden: { y: '105%', rotate: 2, opacity: 0 },
  show:   { y: 0, rotate: 0, opacity: 1, transition: { duration: 1.1, ease: EASE.out } }
}

export const reveal: Variants = {
  hidden: { y: 34, opacity: 0 },
  show:   { y: 0, opacity: 1, transition: { duration: T.slow, ease: EASE.out } }
}

export const stagger = (children = 0.09): Transition => ({ staggerChildren: children })

export const chipPop: Variants = {
  hidden: { scale: 0.7, opacity: 0 },
  show:   { scale: 1, opacity: 1, transition: { duration: 0.5, ease: EASE.out } }
}

export const priceBump: Variants = {
  idle: { scale: 1 },
  bump: { scale: [1, 1.14, 1], color: '#E0A72C', transition: { duration: 0.5, ease: EASE.out } }
}

export const marquee = {
  durationSec: 30,
  tickerDurationSec: 34,
  orbitSpinSec: 46
}

export const reduceMotionFallback = {
  // when prefers-reduced-motion: skip intro entirely, reveals render final state
  intro: 'none',
  reveal: 'final'
}
