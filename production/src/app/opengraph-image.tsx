import { ImageResponse } from 'next/og'

/**
 * Build-time OG image (1200×630): black stage, gold NILE BITES, tagline.
 * Served at /opengraph-image → picked up by og:image + twitter card.
 */
export const alt = 'Nile Bites — Egyptian Street Food. Made to Go.'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%', height: '100%', display: 'flex', flexDirection: 'column',
          justifyContent: 'center', padding: 80, background: '#0B0906', color: '#F5EFE0',
          fontFamily: 'sans-serif', position: 'relative'
        }}
      >
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 14, background: '#E0A72C' }} />
        <div style={{ display: 'flex', alignItems: 'center', gap: 18, marginBottom: 26 }}>
          <svg width="54" height="54" viewBox="0 0 40 40">
            <path d="M4 26c5-7 10 3 16-2s8 5 16-4" fill="none" stroke="#E0A72C" strokeWidth="3.4" strokeLinecap="round" />
          </svg>
          <span style={{ fontSize: 22, letterSpacing: 6, color: '#DCC79B' }}>EGYPTIAN STREET FOOD</span>
        </div>
        <div style={{ fontSize: 128, lineHeight: 1, fontWeight: 900, letterSpacing: -2 }}>NILE</div>
        <div style={{ fontSize: 128, lineHeight: 1, fontWeight: 900, letterSpacing: -2, color: 'transparent', WebkitTextStroke: '3px #E0A72C' }}>
          BITES
        </div>
        <div style={{ marginTop: 30, fontSize: 30, color: '#E2703A', fontWeight: 700 }}>
          Hot dumplings. Bold sauces. One unforgettable bite.
        </div>
        <div style={{ position: 'absolute', bottom: 56, left: 80, fontSize: 22, color: 'rgba(245,239,224,.6)' }}>
          nilebites.com · Hurghada · Cairo soon
        </div>
      </div>
    ),
    { ...size }
  )
}
