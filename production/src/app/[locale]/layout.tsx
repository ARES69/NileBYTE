import type { Metadata, Viewport } from 'next'
import localFont from 'next/font/local'
import { NextIntlClientProvider } from 'next-intl'
import { getMessages } from 'next-intl/server'
import { isRtl, hreflangAlternates, locales, type Locale } from '@/lib/i18n'
import './globals.css'

/** Brand fonts shipped from /public/fonts (same files as the concept build). */
const anton = localFont({ src: '../../../public/fonts/Anton-Regular.ttf', variable: '--font-anton', display: 'swap' })
const archivo = localFont({ src: '../../../public/fonts/Archivo-Variable.ttf', variable: '--font-archivo', display: 'swap' })
const cairo = localFont({ src: '../../../public/fonts/Cairo-Variable.ttf', variable: '--font-cairo', display: 'swap' })

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? 'https://nilebites.com'),
  title: 'Nile Bites — Egyptian Street Food. Made to Go.',
  description: 'Hot dumplings, bold sauces, one unforgettable bite. Egyptian street food made to go.',
  alternates: { languages: hreflangAlternates('/', process.env.NEXT_PUBLIC_SITE_URL ?? 'https://nilebites.com') },
  openGraph: { title: 'Nile Bites', description: 'Taste the Nile.', type: 'website' }
}

export const viewport: Viewport = {
  themeColor: '#0B0906',
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover'
}

/** Restaurant + Menu + FAQ structured data (SPEC §13.5) — injected once, per locale. */
function JsonLd() {
  const data = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Restaurant',
        name: 'Nile Bites',
        servesCuisine: ['Egyptian', 'Street food', 'Dumplings'],
        telephone: '+20650000000',
        priceRange: 'EGP 95-235',
        acceptsReservations: false,
        address: { '@type': 'PostalAddress', streetAddress: 'Sheraton Road, El Dahar', addressLocality: 'Hurghada', addressCountry: 'EG' },
        geo: { '@type': 'GeoCoordinates', latitude: 27.2579, longitude: 33.8116 },
        openingHoursSpecification: [
          { '@type': 'OpeningHoursSpecification', dayOfWeek: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday'], opens: '10:00', closes: '02:00' },
          { '@type': 'OpeningHoursSpecification', dayOfWeek: ['Friday', 'Saturday'], opens: '10:00', closes: '03:00' }
        ]
      }
    ]
  }
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }} />
}

export function generateStaticParams() {
  return locales.map(l => ({ locale: l }))
}

export default async function RootLayout({ children, params }: { children: React.ReactNode; params: Promise<{ locale: Locale }> }) {
  const locale = ((await params).locale || 'en') as Locale
  const messages = await getMessages()
  return (
    <html lang={locale} dir={isRtl(locale) ? 'rtl' : 'ltr'} className={`${anton.variable} ${archivo.variable} ${cairo.variable}`}>
      <body className="bg-black text-cream font-body antialiased">
        <NextIntlClientProvider messages={messages}>{children}</NextIntlClientProvider>
        <JsonLd />
      </body>
    </html>
  )
}
