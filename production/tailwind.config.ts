import type { Config } from 'tailwindcss'

/**
 * Nile Bites design tokens — ported 1:1 from SPEC.md §2 (design system).
 * Single source of truth: brand/BRANDBOOK.md §3–4.
 */
const config: Config = {
  content: ['./src/**/*.{ts,tsx,mdx}'],
  theme: {
    extend: {
      colors: {
        black:   '#0B0906',   // brand stage
        ink:     '#141110',   // cards on black
        cream:   '#F5EFE0',   // light content blocks / text on dark
        sand:    '#DCC79B',
        sand2:   '#C9AE7C',
        gold:    '#E0A72C',
        goldlt:  '#F2CE72',
        terra:   '#C4562A',
        terralt: '#E2703A',
        chili:   '#C0392B',
        nile:    '#1E6F5C',
        muted:   'rgba(245,239,224,0.62)',
        mutedd:  'rgba(11,9,6,0.60)'
      },
      fontFamily: {
        display: ['var(--font-anton)', 'Archivo Black', 'Arial Black', 'Impact', 'sans-serif'],
        body:    ['var(--font-archivo)', 'Manrope', 'system-ui', 'sans-serif'],
        ar:      ['var(--font-cairo)', 'Segoe UI', 'Tahoma', 'sans-serif']
      },
      borderRadius: { card: '22px', field: '12px', pill: '999px' },
      maxWidth: { shell: '1400px' },
      keyframes: {
        marquee: { to: { transform: 'translateX(-50%)' } },
        steam:   { '0%': { transform: 'translateY(0) scale(.6)', opacity: '0' }, '20%': { opacity: '.75' }, '100%': { transform: 'translateY(-70px) scale(2.1)', opacity: '0' } },
        floatcup:{ from: { transform: 'translateY(0) rotate(-1deg)' }, to: { transform: 'translateY(-18px) rotate(1.4deg)' } },
        pulsering:{ '0%': { transform: 'scale(1)', opacity: '.75' }, '100%': { transform: 'scale(2.6)', opacity: '0' } }
      },
      animation: {
        marquee: 'marquee 30s linear infinite',
        steam: 'steam 3.4s linear infinite',
        floatcup: 'floatcup 7s cubic-bezier(.22,.61,.36,1) infinite alternate',
        pulsering: 'pulsering 2.4s cubic-bezier(.22,.61,.36,1) infinite'
      },
      transitionTimingFunction: {
        ease: 'cubic-bezier(.22,.61,.36,1)',
        easeout: 'cubic-bezier(.16,1,.3,1)'
      }
    }
  },
  plugins: []
}
export default config
