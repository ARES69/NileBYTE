'use client'
/** Sticky mobile/desktop ORDER bar — SPEC §6: appears after 85vh, hides at footer. */
import { useEffect, useState } from 'react'
import Link from 'next/link'

export function OrderBar() {
  const [on, setOn] = useState(false)
  useEffect(() => {
    const onScroll = () => {
      const footer = document.querySelector('footer')
      const footerTop = footer ? footer.getBoundingClientRect().top : Infinity
      setOn(window.scrollY > window.innerHeight * 0.85 && footerTop > window.innerHeight * 0.75)
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    onScroll()
    return () => window.removeEventListener('scroll', onScroll)
  }, [])
  return (
    <div className={`pointer-events-none fixed inset-x-0 bottom-0 z-[110] p-3 pb-[calc(12px+env(safe-area-inset-bottom))] transition-transform duration-500 ${on ? 'translate-y-0' : 'translate-y-[140%]'} bg-gradient-to-t from-black/95 to-transparent`}>
      <Link href="/order" className="pointer-events-auto mx-auto flex max-w-[560px] items-center justify-between gap-4 rounded-pill bg-gold px-7 py-4 text-sm font-black uppercase tracking-[0.14em] text-black shadow-[0_18px_40px_rgba(0,0,0,0.45)]">
        <span>Order Nile</span>
        <b className="font-display text-lg tracking-normal">— EGP</b>
      </Link>
    </div>
  )
}
