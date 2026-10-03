# NILE BITES — PRODUCTION RUNBOOK
### Скелет → прод · v1.0 · accompany: package.json, prisma/, cms/, src/, .github/

## 1. Стек (по брифу §37 + уточнения)
| Слой | Выбор | Почему |
|---|---|---|
| Frontend | **Next.js 15 (App Router)** + Tailwind 3.4 + Framer Motion 11 | токены из SPEC уже портированы в tailwind.config.ts и lib/motion.ts |
| i18n | **next-intl**, locales en/ar/ru, prefix `as-needed` (`/`, `/ar`, `/ru`) | AR = full RTL; RU = tourist layer с фолбэком EN |
| CMS | **Sanity** (cms/schema.ts): products, stores, sauces, socialClips, faq, pageSeo | visual editing для меню/точек/соц-контента; заказы/сканы НЕ в CMS |
| DB | **PostgreSQL 16 (Neon/RDS)** + Prisma (prisma/schema.prisma) | orders, scans, club, referrals, leads, consents |
| Payments | **Paymob** (EG cards/wallets) + cash/wallet offline; альтернатива Kashier/Fawry | локальные методы оплаты, PCI на стороне гейтвея |
| Delivery | deep-links talabat/elmenus per store (CMS `partnerLinks`) + свой pickup | рынок EG = дуополия (NEXT.md P0-1) |
| WhatsApp | WhatsApp Business Cloud API (префаки заказов из конструктора) | +40% заказов в пик (NEXT.md P0-2) |
| Analytics | GA4 + **Matomo self-host** (consent-gated) + своя scan-CRM (таблица Scan) | EG DPL 151/2020 + GDPR для туристов |
| Hosting | Vercel (edge) + Neon PG + Sanity CDN; медиа → R2/S3 + AVIF | LCP < 2.5 s бюджет |
| Monitor | Sentry (web + api), uptime cron `/api/health`, Sentry-алерт на EBITDA-метрики дня | |

## 2. Роуты
```
/                      home (секции SPEC §5.1–5.15)
/order                 checkout-остров (location → cup → pay)
/locations/[slug]      per-store (SSG + ISR 5 min)
/bite/[qr]             QR-лендинг YOUR BITE (noindex)
/franchise, /club, /careers, /contact
/ar/*, /ru/*           локали
/api/order /api/scan /api/lead /api/deck /api/consent /api/health
/admin                 → отдельный app (Nile Admin v2: Next + тот же Prisma)
```

## 3. Данные: контракт сайт ↔ админ
- Сайт пишет через API → Postgres; админка читает те же таблицы (Order, Scan, ClubMember, FranchiseLead, DeckDownload, ConsentLog).
- localStorage-мост концепта (`nb-*`) остаётся только в концепт-прототипе.
- Points: PointLedger append-only; начисление = size × qty при статусе DONE; redeem −100.
- Scan.repeat считается по deviceId-хэшу → repeat rate из брифа §36.

## 4. Безопасность и комплаенс
- EG Data Protection Law 151/2020: consent-лог обязателен перед marketing/analytics-куками; privacy-центр = страница + API.
- Платежи: только tokenize-гейтвей (Paymob), card data не касаемся; 3DS обязательно.
- Deck: signed URL с TTL 24 h после /api/deck; публичной ссылки нет.
- Rate-limit на /api/order|lead|deck (upstash/ratelimit): 10 req/min/ip.
- CSP: default-src 'self'; img cdn; script 'self' + ga4 только при consent.analytics.
- Бэкапы PG: PITR 7 дней; restore-дрill раз в квартал.

## 5. Аналитика-контур (бриф §36/§38)
- События: scan(store, sku, batch, stars, repeat), order(channel, total, items), club_join, refer_sent/converted, deck_download, lead_stage_change.
- Дашборд Nile Admin v2 = витрины над этими таблицами: TODAY (orders, revenue, avg check, top product/sauce, peak hour), когорты, LTV/CAC, QR-воронка.
- UTM-соглашение: utm_source=tiktok|ig|qr|talabat|elmenus|wa; qr-парт-номер в batch.

## 6. Rollout-чеклист (6 недель)
1. W1: **готов к старту**: миграция SQL сгенерирована (prisma/migrations/0001_init), seed (staff/stores/products), messages EN/AR/RU портированы автоматом (scripts/extract-messages.py, 340 ключей), i18n routing/request, Sanity config, /api/health, scripts/w1.sh bootstrap, покассовый план и gate в docs/W1-KICKOFF.md, секреты-чеклист .github/SECRETS.md.
2. W2: контент-порт из концепта (data-en/ar/ru → messages/*.json), медиа-пайплайн AVIF, LCP-бюджет.
3. W3: payments sandbox Paymob, WhatsApp Cloud API номер, order status webhooks → KDS.
4. W4: QR-печать (batch A), scan-CRM e2e, consent + privacy-центр, legal-ревью AR/EN.
5. W5: load-test (k6 300 rps /api/order), a11y-аудит (axe + ручной keyboard), SEO-аудит (schema, hreflang, GBP).
6. W6: soft-launch Хургада, UGC-модерация #MyNileBite, алерты метрик, runbook-тренировка смены.

## 6.6 API-контур проверен против живой БД (pre-W1, полный прогон)
next build (30 роутов, 6 store-страниц пререндерены, OG/robots/sitemap/manifest) + next start, затем:
health 200 (db 136 ms) → login admin 200 → GET stores (6, hurghada live) → POST stores 201 + invite →
onboard 200 (5 QR-партии A, ready-for-qa) → POST order 200 (NB-3724, 279 EGP = 310−10% NILE10, points 24) →
kitchen bump PREP 200 → PREP→DONE отклонён 409 (машина статусов держит) → scan 200 → cron/sla 200 →
lead 200 → **SSE /api/kds/stream отдаёт живые события Outbox** (order_status/order_cancel/order_new).
Замечания среды: 1 GB RAM → typecheck вынесен в `npm run lint` (tsc --noEmit зелёный), в build игнорируется;
next поднят до 15.5.4 (CVE-2025-66478); sanity-студия типизирована шимами (студия деплоится отдельно).

## 6.5 Postgres проверен вживую (pre-W1)
- PG15 поднят локально, БД `nilebites`, миграция `0001_init` (13 таблиц) накатана напрямую из SQL.
- Seed: 5 продуктов, 6 точек (Hurghada live), 3 staff (bcrypt-хэши; dev-пароль Nile#2026).
- Smoke-контур пройден против живой БД: заказ NEW→PREP→READY→DONE + outbox-события, points ledger +24, QR-скан с жалобой 2★ и repeat-флагом, отмена с причиной, SLA-брэш; read-back метриками Admin v2 (sales/cancels/complaints/breaches/points/outbox tail) — всё сошлось.
- Инструменты: `production/scripts/dbtools/` (pg + bcryptjs, seed.mjs, smoke.mjs) — лёгкая проверка без ORM; для команды — `docker-compose.yml` (PG16 + Adminer) и `scripts/w1.sh`.
- Вывод: схема и событийная модель рабочими доказаны; W1 может стартовать с боевыми ключами.

## 6.7 Мост концепт-сайт ↔ live API (demo-стыковка, реализовано)
- API-роуты order/scan/lead/deck получили CORS (`lib/cors.ts`: preflight + jres) — концепт с :8000/file:// ходит в API на :3000.
- Концепт `src/app.js`: `apiPost()` + фолбэк — если API недоступен, checkout/scan/lead/deck работают в offline-демо (localStorage), без ошибок.
- Checkout: успешный ответ API → реальный publicId из PG + плашка «LIVE API: order saved to PostgreSQL» и тост; промо/очки/ETA считаются сервером (lib/pricing.ts).
- QR-звёзды → POST /api/scan; франшиз-форма → /api/lead; гейт дека → /api/deck (всё fire-and-forget поверх локальной записи).
- i18n-рефактор прода: page-routes под `app/[locale]/` (en/ar/ru пререндерены), middleware i18n не трогает api/assets; admin/kds тоже под [locale] (EN-UI).
- E2e доказано: концепт :8000 → checkout → PG-строка NB-7012 → /admin/orders?q=NB-7012 показывает заказ (скриншоты shots/110-111).

## 7. Что переносим из концепта 1:1
- Все секции home (SPEC §5), motion-таймлайны (lib/motion.ts), палитра/типографика (tailwind.config), pricing (lib/pricing.ts = app.js PRICING), QR-логика, consent-логика, checkout-шаги, admin-виджеты (NEXT.md §19).
- Фото/борды: `nilebites/img/*`, `franchise-kit/brand-board.jpg` → CDN.
- Дек: `franchise-kit/NileBites-Franchise-Deck.pdf` → R2 + signed URL.
