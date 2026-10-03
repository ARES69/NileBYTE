/**
 * smoke.mjs — proves the ops loop against live PostgreSQL (schema + outbox events + risk reads).
 * Order lifecycle → outbox events → scan complaint → cancel → risk metrics, like Nile Admin v2 reads them.
 */
import pg from 'pg'

const url = process.env.DATABASE_URL || 'postgres://nile:nile@127.0.0.1:5432/nilebites'
const db = new pg.Client({ connectionString: url })
await db.connect()
const q = (t, p) => db.query(t, p)

const store = (await q(`SELECT id FROM "Store" WHERE slug='hurghada'`)).rows[0]
const sid = store.id

// 1) order NEW → PREP → READY → DONE with outbox events (the exact flow /api/order + /api/orders/[id]/status + KDS SSE use)
const ord = await q(
  `INSERT INTO "Order" ("publicId", "storeId", channel, status, items, "subtotalEgp", "deliveryEgp", "discountEgp", "totalEgp", "payMethod", name, phone, "createdAt", "updatedAt")
   VALUES ('NB-9001', $1, 'SITE', 'NEW', $2::jsonb, 310, 0, 31, 279, 'card', 'Smoke Test', '+201000000001', now(), now()) RETURNING id`,
  [sid, JSON.stringify([{ bite: 'shawarma', size: '12', sauce: 'garlic', tops: ['onion'], qty: 2, unit: 155 }])]
)
for (const st of ['PREP', 'READY', 'DONE']) {
  await q(`UPDATE "Order" SET status=$1, "updatedAt"=now() WHERE id=$2`, [st, ord.rows[0].id])
  await q(`INSERT INTO "Outbox" ("storeId", type, payload, "createdAt") VALUES ($1, 'order_status', $2::jsonb, now())`,
    [sid, JSON.stringify({ id: 'NB-9001', to: st })])
}
// points ledger for DONE (12 bites × 2 qty)
const member = await q(
  `INSERT INTO "ClubMember" (id, "publicId", phone, points, tier, "createdAt") VALUES (gen_random_uuid(), 'NB-CLUB-9001', '+201000000001', 0, 'starter', now()) RETURNING id`
)
await q(`INSERT INTO "PointLedger" ("memberId", "orderId", delta, reason, "createdAt") VALUES ($1, $2, 24, 'purchase', now())`, [member.rows[0].id, ord.rows[0].id])
await q(`UPDATE "ClubMember" SET points = points + 24 WHERE id=$1`, [member.rows[0].id])

// 2) QR scan with a 2★ complaint + a repeat scan
await q(`INSERT INTO "Scan" (id, "storeId", sku, batch, stars, "deviceId", referrer, repeat, "createdAt") VALUES (gen_random_uuid(), $1, 'shawarma', 'A', 2, 'dev-smoke-01', 'utm_source=qr', false, now())`, [sid])
await q(`INSERT INTO "Scan" (id, "storeId", sku, batch, stars, "deviceId", referrer, repeat, "createdAt") VALUES (gen_random_uuid(), $1, 'kofta', 'A', 5, 'dev-smoke-01', 'utm_source=qr', true, now())`, [sid])

// 3) a cancelled order with reason (Risk feed)
await q(
  `INSERT INTO "Order" ("publicId", "storeId", channel, status, items, "subtotalEgp", "deliveryEgp", "discountEgp", "totalEgp", "payMethod", "createdAt", "updatedAt")
   VALUES ('NB-9002', $1, 'TALABAT', 'CANCELLED', $2::jsonb, 150, 0, 0, 150, 'card', now(), now())`,
  [sid, JSON.stringify([{ bite: 'shatta', size: '12', sauce: 'shatta', tops: [], qty: 1, unit: 150 }])]
)
await q(`INSERT INTO "Outbox" ("storeId", type, payload, "createdAt") VALUES ($1, 'order_cancel', $2::jsonb, now())`,
  [sid, JSON.stringify({ id: 'NB-9002', why: 'smoke: customer changed mind' })])

// 4) SLA breach event (cron would emit this in prod)
await q(`INSERT INTO "Outbox" ("storeId", type, payload, "createdAt") VALUES ($1, 'sla_breach', $2::jsonb, now())`,
  [sid, JSON.stringify({ id: 'NB-9003', waitMin: 14 })])

// ---- read back like Admin v2 does ----
const day = await q(`SELECT COUNT(*)::int n, COALESCE(SUM("totalEgp"),0)::int rev FROM "Order" WHERE "createdAt" >= current_date AND status <> 'CANCELLED'`)
const canc = await q(`SELECT COUNT(*)::int n FROM "Order" WHERE "createdAt" >= current_date AND status = 'CANCELLED'`)
const comp = await q(`SELECT COUNT(*)::int n FROM "Scan" WHERE stars <= 2 AND "createdAt" >= current_date`)
const breach = await q(`SELECT COUNT(*)::int n FROM "Outbox" WHERE type='sla_breach' AND "createdAt" >= current_date`)
const pts = await q(`SELECT COALESCE(SUM(delta),0)::int s FROM "PointLedger"`)
const feed = await q(`SELECT type, payload->>'id' id FROM "Outbox" ORDER BY id DESC LIMIT 6`)

console.log('\n=== SMOKE vs LIVE POSTGRES ===')
console.log('sales today :', day.rows[0].n, 'orders /', day.rows[0].rev, 'EGP')
console.log('cancellations:', canc.rows[0].n, '| complaints 1-2★:', comp.rows[0].n, '| sla breaches:', breach.rows[0].n)
console.log('points ledger:', pts.rows[0].s)
console.log('outbox tail   :', feed.rows.map(r => `${r.type}:${r.id ?? '-'}`).join(' → '))
console.log('================================\n')
await db.end()
