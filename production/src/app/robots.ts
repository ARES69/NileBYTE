import type { MetadataRoute } from 'next'

/** robots.txt — allow all, point sitemap, keep admin & QR landings out of index. */
export default function robots(): MetadataRoute.Robots {
  const base = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://nilebites.com'
  return {
    rules: [
      { userAgent: '*', allow: '/', disallow: ['/admin', '/bite/', '/api/'] }
    ],
    sitemap: `${base}/sitemap.xml`
  }
}
