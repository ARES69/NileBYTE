/**
 * Nile Bites — i18n routing (next-intl).
 * EN default, AR full RTL, RU tourist layer (falls back to EN per string).
 * Dictionaries live in src/messages/*.json — port data-en/ar/ru attributes
 * from the concept prototype (src/index.html) 1:1.
 */
export const locales = ['en', 'ar', 'ru'] as const
export type Locale = (typeof locales)[number]
export const defaultLocale: Locale = 'en'

export const isRtl = (l: Locale) => l === 'ar'

/** <html lang dir> + hreflang alternates for every route (SPEC §13.5). */
export function hreflangAlternates(path: string, baseUrl: string) {
  return {
    'en': `${baseUrl}${path}`,
    'ar': `${baseUrl}/ar${path}`,
    'ru': `${baseUrl}/ru${path}`,
    'x-default': `${baseUrl}${path}`
  }
}

export const fontStacks: Record<Locale, { display: string; body: string }> = {
  en: { display: 'var(--font-anton)', body: 'var(--font-archivo)' },
  ar: { display: 'var(--font-cairo)', body: 'var(--font-cairo)' },
  ru: { display: 'var(--font-anton), Arial Black', body: 'var(--font-archivo)' }
}
