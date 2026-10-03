import type { MetadataRoute } from 'next'

/** PWA manifest — concept icons live at /icons (generated in concept repo: icon-192/512.png). */
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Nile Bites — Egyptian Street Food. Made to Go.',
    short_name: 'Nile Bites',
    description: 'Hot dumplings, bold sauces, one unforgettable bite. Order cups, scan QR, earn Nile Club points.',
    start_url: '/',
    scope: '/',
    display: 'standalone',
    orientation: 'portrait',
    background_color: '#0B0906',
    theme_color: '#0B0906',
    categories: ['food', 'lifestyle'],
    icons: [
      { src: '/icons/icon-192.png', sizes: '192x192', type: 'image/png', purpose: 'any' },
      { src: '/icons/icon-512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' }
    ]
  }
}
