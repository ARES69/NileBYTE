/**
 * Nile Bites — pricing engine (single source of truth for site + order API).
 * Port of src/app.js PRICING/SAUCES/SIZES/TOPS from the concept prototype.
 * Prices in EGP, base = 12 bites.
 */
import { z } from 'zod'

export const PRICING = {
  kofta:    { base: 145, en: 'Beef Kofta',       ar: 'كفتة لحمة',   ru: 'Говяжья кофта',  color: '#8A4A22' },
  shawarma: { base: 140, en: 'Chicken Shawarma', ar: 'شاورما فراخ', ru: 'Куриная шаурма', color: '#C9962F' },
  cheese:   { base: 125, en: 'Cheese & Herb',    ar: 'جبنة وأعشاب', ru: 'Сыр и травы',    color: '#E3C567' },
  shrimp:   { base: 175, en: 'Nile Shrimp',      ar: 'جمبري النيل', ru: 'Нильская креветка', color: '#D9613C' }
} as const
export type BiteId = keyof typeof PRICING

export const SAUCES = {
  garlic:    { price: 0,  en: 'Nile Garlic',    ar: 'توم النيل',  ru: 'Чесночный Нил', color: '#F3E6C4' },
  tahini:    { price: 0,  en: 'Tahini',         ar: 'طحينة',      ru: 'Тахини',        color: '#D8C39A' },
  shatta:    { price: 0,  en: 'Shatta',         ar: 'شطة',        ru: 'Шатта',         color: '#C0392B' },
  signature: { price: 10, en: 'Nile Signature', ar: 'صوص النيل', ru: 'Фирменный Нил', color: '#E0A72C' }
} as const
export type SauceId = keyof typeof SAUCES

export const SIZES = { '8': { add: -40 }, '12': { add: 0 }, '18': { add: 45 } } as const
export type SizeId = keyof typeof SIZES

export const TOPS = {
  herbs:  { price: 0,  en: 'Herbs',        ar: 'أعشاب',      ru: 'Травы' },
  chilli: { price: 5,  en: 'Chilli',       ar: 'شطة',        ru: 'Чили' },
  onion:  { price: 10, en: 'Crispy Onion', ar: 'بصل مقلي',   ru: 'Хрустящий лук' },
  cheese: { price: 15, en: 'Extra Cheese', ar: 'جبنة زيادة', ru: 'Доп. сыр' },
  lemon:  { price: 0,  en: 'Lemon',        ar: 'ليمون',      ru: 'Лимон' }
} as const
export type TopId = keyof typeof TOPS

export const DELIVERY = { feeEgp: 20, freeOverEgp: 300, etaMin: [45, 60] } as const
export const PROMO = { NILE10: 0.10 } as const

export const CupSchema = z.object({
  bite:  z.enum(['kofta', 'shawarma', 'cheese', 'shrimp']),
  sauce: z.enum(['garlic', 'tahini', 'shatta', 'signature']),
  size:  z.enum(['8', '12', '18']),
  tops:  z.array(z.enum(['herbs', 'chilli', 'onion', 'cheese', 'lemon'])).max(5),
  qty:   z.number().int().min(1).max(12)
})
export type Cup = z.infer<typeof CupSchema>

export function cupUnitPrice(cup: Omit<Cup, 'qty'>): number {
  let p = PRICING[cup.bite].base + SIZES[cup.size].add + SAUCES[cup.sauce].price
  for (const t of cup.tops) p += TOPS[t].price
  return Math.max(0, p)
}

export function quote(cup: Cup, mode: 'pickup' | 'delivery', promo?: string) {
  const unit = cupUnitPrice(cup)
  const subtotal = unit * cup.qty
  const delivery = mode === 'delivery' ? (subtotal >= DELIVERY.freeOverEgp ? 0 : DELIVERY.feeEgp) : 0
  const rate = promo && promo in PROMO ? PROMO[promo as keyof typeof PROMO] : 0
  const discount = Math.round(subtotal * rate)
  return { unit, subtotal, delivery, discount, total: Math.max(0, subtotal + delivery - discount), points: parseInt(cup.size, 10) * cup.qty }
}
