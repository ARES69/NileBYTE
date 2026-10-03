/**
 * seed.mjs — W1 baseline data into live PostgreSQL (pg + bcryptjs, no ORM).
 * Mirrors prisma/seed.ts. Run: node seed.mjs   (env: DATABASE_URL or defaults nile/nile@127.0.0.1/nilebites)
 */
import pg from 'pg'
import bcrypt from 'bcryptjs'

const url = process.env.DATABASE_URL || 'postgres://nile:nile@127.0.0.1:5432/nilebites'
const db = new pg.Client({ connectionString: url })
await db.connect()

const SIZE_DELTA = JSON.stringify({ '8': -40, '12': 0, '18': 45 })
const PRODUCTS = [
  ['kofta', 'Beef Kofta', 'كفتة لحمة', 'Говяжья кофта', 'Beef, onion, Egyptian spices', 145, ['GL', 'EG'], [], 520, 1],
  ['shawarma', 'Chicken Shawarma', 'شاورما فراخ', 'Куриная шаурма', 'Chicken, garlic, spices', 140, ['GL', 'DA'], [], 480, 2],
  ['shatta', 'Shatta Beef', 'لحمة شطة', 'Говядина шатта', 'Spicy beef, chilli, herbs', 150, ['GL', 'EG'], ['spicy'], 500, 3],
  ['cheese', 'Cheese & Herb', 'جبنة وأعشاب', 'Сыр и травы', 'Cheese, herbs, garlic', 125, ['GL', 'DA'], ['veg'], 460, 4],
  ['shrimp', 'Nile Shrimp', 'جمبري النيل', 'Нильская креветка', 'Shrimp, garlic, lemon', 175, ['GL', 'SH', 'EG'], ['sea'], 430, 5]
]
for (const [slug, en, ar, ru, desc, price, alg, tags, kcal, sort] of PRODUCTS) {
  await db.query(
    `INSERT INTO "Product" (id, slug, "nameEn", "nameAr", "nameRu", "descEn", "descAr", "priceEgp", "sizeDelta", allergens, tags, kcal, image, "onSale", "sortOrder", "createdAt")
     VALUES (gen_random_uuid(), $1,$2,$3,$4,$5,$6,$7,$8::jsonb,$9,$10,$11,$12,true,$13, now())
     ON CONFLICT (slug) DO NOTHING`,
    [slug, en, ar, ru, desc, desc, price, SIZE_DELTA, alg, tags, kcal, `/img/bite-${slug}.jpg`, sort]
  )
}

const STORES = [
  ['hurghada', 'Hurghada', 'الغردقة', 'Sheraton Road, El Dahar', 'شارع الشيراتون، الدهار', 27.2579, 33.8116, true, ['El Dahar', 'Sakala', 'Marina']],
  ['cairo-zamalek', 'Cairo', 'القاهرة', 'Zamalek — opening 2027', 'الزمالك — افتتاح ٢٠٢٧', 30.0626, 31.2197, false, []],
  ['alexandria', 'Alexandria', 'الإسكندرية', 'Corniche — planned', 'الكورنيش — مخطط', 31.2001, 29.9187, false, []],
  ['sharm', 'Sharm El Sheikh', 'شرم الشيخ', 'Naama Bay — planned', 'نعمة باي — مخطط', 27.9158, 34.33, false, []],
  ['marsa-alam', 'Marsa Alam', 'مرسى علم', 'Marina — planned', 'المارينا — مخطط', 25.0653, 34.8946, false, []],
  ['luxor', 'Luxor', 'الأقصر', 'Corniche — planned', 'الكورنيش — مخطط', 25.6872, 32.6396, false, []]
]
for (const [slug, city, cityAr, addr, addrAr, lat, lng, live, zones] of STORES) {
  await db.query(
    `INSERT INTO "Store" (id, slug, city, "cityAr", address, "addressAr", lat, lng, phone, "mapsUrl", live, hours, delivery, partners, "createdAt")
     VALUES (gen_random_uuid(), $1,$2,$3,$4,$5,$6,$7,'+20650000000',$8,$9,
       '{"sunThu":"10:00 — 02:00","friSat":"10:00 — 03:00"}'::jsonb,
       $10::jsonb, '{"talabat":"https://www.talabat.com/egypt","elmenus":"https://www.elmenus.com"}'::jsonb, now())
     ON CONFLICT (slug) DO NOTHING`,
    [slug, city, cityAr, addr, addrAr, lat, lng, `https://maps.google.com/?q=${encodeURIComponent(city)}`, live,
     JSON.stringify({ zones, feeEgp: 20, freeOverEgp: 300, etaMin: [45, 60] })]
  )
}

const hash = await bcrypt.hash(process.env.SEED_ADMIN_PASSWORD || 'Nile#2026', 10)
const hur = await db.query(`SELECT id FROM "Store" WHERE slug='hurghada'`)
for (const [email, role, storeId] of [
  ['admin@nilebites.com', 'admin', null],
  ['manager.hurghada@nilebites.com', 'manager', hur.rows[0]?.id ?? null],
  ['kitchen.hurghada@nilebites.com', 'kitchen', hur.rows[0]?.id ?? null]
]) {
  await db.query(
    `INSERT INTO "Staff" (id, email, "passwordHash", role, "storeId", "createdAt")
     VALUES (gen_random_uuid(), $1, $2, $3, $4, now()) ON CONFLICT (email) DO NOTHING`,
    [email, hash, role, storeId]
  )
}

const counts = {}
for (const t of ['Product', 'Store', 'Staff']) counts[t] = (await db.query(`SELECT COUNT(*)::int c FROM "${t}"`)).rows[0].c
console.log('seeded into', url.replace(/:[^:@]+@/, ':***@'), counts)
await db.end()
