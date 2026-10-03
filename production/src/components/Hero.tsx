'use client'
/** Hero — SPEC §5.1: photo stage + scrims, NILE / outlined BITES, sub, lead, CTA, ticker. */
import { motion } from 'framer-motion'
import { heroLine, reveal, EASE } from '@/lib/motion'
import Link from 'next/link'

export function Hero() {
  return (
    <section className="relative flex min-h-svh items-end overflow-hidden bg-black pt-20">
      <div className="absolute inset-0">
        {/* TODO: next/image priority from CDN; concept used hero-cup.jpg */}
        <div className="absolute inset-0 bg-[image:var(--hero-img)] bg-cover bg-[position:62%_38%]" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/95 via-black/80 to-black/40" />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-black/60" />
      </div>

      <div className="wrap relative z-10 pb-28">
        <motion.p initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, ease: EASE.out }}
          className="mb-6 flex items-center gap-3 text-[11px] font-bold uppercase tracking-[0.3em] text-sand">
          <span className="h-2 w-2 animate-pulsering rounded-full bg-terralt" /> CAIRO · HURGHADA · SHARM · ALEXANDRIA
        </motion.p>
        <h1 className="display leading-[0.82]">
          <span className="block overflow-hidden"><motion.span className="block text-[clamp(74px,17vw,238px)] text-cream" variants={heroLine} initial="hidden" animate="show">NILE</motion.span></span>
          <span className="block overflow-hidden"><motion.span className="block text-[clamp(74px,17vw,238px)] text-transparent [-webkit-text-stroke:2.5px_#E0A72C]" variants={heroLine} initial="hidden" animate="show" style={{ transition: { delay: 0.14 } } as never}>BITES</motion.span></span>
        </h1>
        <motion.h2 initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4, duration: 0.9 }}
          className="display mt-5 text-[clamp(17px,2.5vw,32px)] text-sand">
          EGYPTIAN STREET FOOD<br /><span className="text-terralt">MADE TO GO.</span>
        </motion.h2>
        <motion.p variants={reveal} initial="hidden" animate="show" className="mt-6 max-w-[36ch] text-cream/80">
          Hot dumplings. Bold sauces. One unforgettable bite.
        </motion.p>
        <motion.div variants={reveal} initial="hidden" animate="show" className="mt-8 flex flex-wrap gap-3.5">
          <Link href="/order" className="btn-gold">Order now</Link>
          <Link href="/#bites" className="btn-ghost">Explore menu</Link>
        </motion.div>
      </div>
      {/* TODO §5.1 ticker marquee + scroll indicator */}
    </section>
  )
}
