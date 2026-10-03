/**
 * prisma/seed.ts — W1 baseline data.
 * Run: npx prisma db seed  (package.json > prisma.seed)
 * Creates: admin/manager/kitchen staff, 6 stores (1 live), 5 products with allergens/kcal.
 */
import { PrismaClient, OrderStatus, OrderChannel } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

export const PRODUCTS = [
  { slug: 'kofta', nameEn: 'Beef Kofta', nameAr: 'كفتة لحمة', nameRu: 'Говяжья кофта', descEn: 'Beef, onion, Egyptian spices', descAr: 'لحمة، بصل، بهارات مصرية', priceEgp: 145, allergens: ['GL', 'EG'], tags: [], kcal: 520, sortOrder: 1 },
  { slug: 'shawarma', nameEn: 'Chicken Shawarma', nameAr: 'شاورما فراخ', nameRu: 'Куриная шаурма', descEn: 'Chicken, garlic, spices', descAr: 'فراخ، توم، بهارات', priceEgp: 140, allergens: ['GL', 'DA'], tags: [], kcal: 480, sortOrder: 2 },
  { slug: 'shatta', nameEn: 'Shatta Beef', nameAr: 'لحمة شطة', nameRu: 'Говядина шатта', descEn: 'Spicy beef, chilli, herbs', descAr: 'لحمة حريقة، شطة، أعشاب', priceEgp: 150, allergens: ['GL', 'EG'], tags: ['spicy'], kcal: 500, sortOrder: 3 },
  { slug: 'cheese', nameEn: 'Cheese & Herb', nameAr: 'جبنة وأعشاب', nameRu: 'Сыр и травы', descEn: 'Cheese, herbs, garlic', descAr: 'جبنة، أعشاب، توم', priceEgp: 125, allergens: ['GL', 'DA'], tags: ['veg'], kcal: 460, sortOrder: 4 },
  { slug: 'shrimp', nameEn: 'Nile Shrimp', nameAr: 'جمبري النيل', nameRu: 'Нильская креветка', descEn: 'Shrimp, garlic, lemon', descAr: 'جمبري، توم، ليمون', priceEgp: 175, allergens: ['GL', 'SH', 'EG'], tags: ['sea'], kcal: 430, sortOrder: 5 }
]

const SIZE_DELTA = { '8': -40, '12': 0, '18': 45 }

async function main() {
  const hash = await bcrypt.hash(process.env.SEED_ADMIN_PASSWORD ?? 'Nile#2026', 10)
  const hashStaff = await bcrypt.hash(process.env.SEED_STAFF_PASSWORD ?? 'Nile#2026', 10)

  for (const p of PRODUCTS) {
    await prisma.product.upsert({
      where: { slug: p.slug },
      update: {},
      create: { ...p, sizeDelta: SIZE_DELTA, image: `/img/bite-${p.slug}.jpg` }
    })
  }

  const hur = await prisma.store.upsert({
    where: { slug: 'hurghada' },
    update: {},
    create: {
      slug: 'hurghada', city: 'Hurghada', cityAr: 'الغردقة',
      address: 'Sheraton Road, El Dahar', addressAr: 'شارع الشيراتون، الدهار',
      lat: 27.2579, lng: 33.8116, phone: '+20650000000',
      mapsUrl: 'https://maps.google.com/?q=Sheraton+Road+Hurghada',
      live: true,
      hours: { sunThu: '10:00 — 02:00', friSat: '10:00 — 03:00' },
      delivery: { zones: ['El Dahar', 'Sakala', 'Marina'], feeEgp: 20, freeOverEgp: 300, etaMin: [45, 60] },
      partners: { talabat: 'https://www.talabat.com/egypt', elmenus: 'https://www.elmenus.com' }
    }
  })
  for (const s of [
    { slug: 'cairo-zamalek', city: 'Cairo', cityAr: 'القاهرة', address: 'Zamalek — opening 2027', addressAr: 'الزمالك — افتتاح ٢٠٢٧', lat: 30.0626, lng: 31.2197 },
    { slug: 'alexandria', city: 'Alexandria', cityAr: 'الإسكندرية', address: 'Corniche — planned', addressAr: 'الكورنيش — مخطط', lat: 31.2001, lng: 29.9187 },
    { slug: 'sharm', city: 'Sharm El Sheikh', cityAr: 'شرم الشيخ', address: 'Naama Bay — planned', addressAr: 'نعمة باي — مخطط', lat: 27.9158, lng: 34.3300 },
    { slug: 'marsa-alam', city: 'Marsa Alam', cityAr: 'مرسى علم', address: 'Marina — planned', addressAr: 'المارينا — مخطط', lat: 25.0653, lng: 34.8946 },
    { slug: 'luxor', city: 'Luxor', cityAr: 'الأقصر', address: 'Corniche — planned', addressAr: 'الكورنيش — مخطط', lat: 25.6872, lng: 32.6396 }
  ]) {
    await prisma.store.upsert({
      where: { slug: s.slug }, update: {},
      create: { ...s, phone: '+20650000000', mapsUrl: `https://maps.google.com/?q=${encodeURIComponent(s.city)}`, live: false,
        hours: { sunThu: '10:00 — 02:00', friSat: '10:00 — 03:00' }, delivery: { zones: [], feeEgp: 20, freeOverEgp: 300, etaMin: [45, 60] }, partners: { talabat: '', elmenus: '' } }
    })
  }

  await prisma.staff.upsert({ where: { email: 'admin@nilebites.com' }, update: {}, create: { email: 'admin@nilebites.com', passwordHash: hash, role: 'admin' } })
  await prisma.staff.upsert({ where: { email: 'manager.hurghada@nilebites.com' }, update: {}, create: { email: 'manager.hurghada@nilebites.com', passwordHash: hashStaff, role: 'manager', storeId: hur.id } })
  await prisma.staff.upsert({ where: { email: 'kitchen.hurghada@nilebites.com' }, update: {}, create: { email: 'kitchen.hurghada@nilebites.com', passwordHash: hashStaff, role: 'kitchen', storeId: hur.id } })

  console.log('seeded: 5 products, 6 stores (1 live), 3 staff (admin / manager / kitchen). Passwords from SEED_*_PASSWORD env (dev default Nile#2026).')
}

main().finally(() => prisma.$disconnect())
