import type { MetadataRoute } from 'next'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

/**
 * sitemap.xml — static routes × locales + live store pages (ISR-friendly: revalidate at build).
 * QR landings (/bite/*) and /admin intentionally excluded (see robots.ts).
 */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://nilebites.com'
  const now = new Date()
  const staticPaths = ['', '/order', '/franchise', '/club', '/careers', '/contact']
  const locales = ['', '/ar', '/ru']

  const entries: MetadataRoute.Sitemap = []
  for (const loc of locales) {
    for (const p of staticPaths) {
      entries.push({ url: `${base}${loc}${p}`, lastModified: now, changeFrequency: 'weekly', priority: p === '' ? 1 : 0.7 })
    }
  }
  const stores = await prisma.store.findMany({ where: { live: true }, select: { slug: true } })
  for (const s of stores) {
    entries.push({ url: `${base}/locations/${s.slug}`, lastModified: now, changeFrequency: 'daily', priority: 0.9 })
    entries.push({ url: `${base}/ar/locations/${s.slug}`, lastModified: now, changeFrequency: 'daily', priority: 0.6 })
  }
  return entries
}
