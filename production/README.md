# nile-bites-web (production skeleton)

Next.js 15 skeleton for the Nile Bites production web: site + QR landing + order/scan/lead API.
Concept source of truth: `../index.html` (prototype), `../SPEC.md`, `../brand/BRANDBOOK.md`.

## Bootstrap
```bash
npm i
cp .env.example .env.local            # fill DATABASE_URL, Sanity, Paymob, WA
mkdir -p public/fonts && cp ../../nilebites/fonts/{Anton-Regular.ttf,Archivo-Variable.ttf,Cairo-Variable.ttf} public/fonts/
npx prisma migrate dev --name init
npx prisma db seed                    # TODO: seed stores/products from ../SPEC §5.4–5.9
npm run dev
```

## Structure
```
prisma/schema.prisma        Postgres: stores, products, orders, scans, club, referrals, leads, consents
cms/schema.ts               Sanity content types (products/stores/sauces/clips/faq/seo)
src/lib/pricing.ts          pricing engine (zod-validated) — port of concept PRICING/quote
src/lib/i18n.ts             locales en|ar|ru, RTL flag, hreflang helper
src/lib/motion.ts           Framer Motion tokens (intro timeline, easings, variants)
src/middleware.ts           next-intl routing (/ , /ar, /ru)
src/app/layout.tsx          fonts (local), JSON-LD Restaurant, dir/lang per locale
src/app/page.tsx            home composition map (SPEC §5) with section TODOs
src/app/bite/[qr]/page.tsx  QR landing YOUR BITE
src/app/admin/**            Nile Admin v2 over Prisma+Outbox: sales, orders, risk, stores, leads, club
src/app/kds/page.tsx        kitchen display (SSE client, BUMP/FIRE)
src/app/onboard/[slug]/     store self-activation (invite → QR batch → QA)
src/app/locations/[slug]    per-store SSG page (hours, zones, partners, NAP)
src/app/api/order|scan|lead route handlers (zod + Prisma)
src/app/api/auth/login        staff JWT (admin|manager|kitchen), long-lived for KDS
src/app/api/stores            admin: create store + invite NB-INV-XXXX (onboarding step 1)
src/app/api/stores/[slug]/onboard  store self-activation + QR batch links (step 2)
src/app/api/kds/stream        SSE live-тикеты кухни (Outbox poll 1.5s)
src/app/api/webhooks/paymob   HMAC-verified payment callbacks
src/app/api/cron/sla          5-min cron: SLA breaches + points intents
src/lib/auth.ts               JWT + roles + scopeStore() tenancy guard
src/lib/events.ts             Outbox event bus (emit/readAfter)
src/components/             Intro, Hero, OrderBar, Consent (working islands)
.github/workflows/ci.yml    lint → build(PG service) → e2e(playwright) → deploy
tests/e2e/smoke.spec.ts     home/order-api/qr/store smokes
docs/PRODUCTION.md          runbook: stack, routes, data contract, security, rollout 6 weeks
docs/BACKEND.md             backend architecture + store onboarding flow («подключение ресторанов»)
docs/VOICE-WA-SPEC.md       voice order → WhatsApp Cloud: прод-спека из LAB-демо
```

## Rules of the repo
1. Design tokens change ONLY in `tailwind.config.ts` + `brand/BRANDBOOK.md` (synced).
2. Prices change ONLY in `src/lib/pricing.ts` (+ Sanity override flag later).
3. New copy enters `src/messages/{en,ar,ru}.json` together (AR = Egyptian register, RU = tourist layer; missing RU falls back EN).
4. Every new API route: zod schema + rate limit + ConsentLog/audit where personal data touches.
5. E2E smoke must stay green in CI before deploy job runs.
