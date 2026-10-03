# NILE BITES — BACKEND ARCHITECTURE & STORE ONBOARDING
### «бекенд для сервера и подключение ресторанов» · v1.0 · accompany: prisma/, src/lib/auth|events, src/app/api/**

## 1. Зачем это нужно (короткий ответ на вопрос)
Да: сайту нужен серверный контур, потому что концепт-прототип хранит данные в localStorage браузера.
Прод-схема: **сайт/QR/WhatsApp → API → PostgreSQL**, а каждая точка (ресторан) подключается через
**onboarding-поток** с invite-кодом, после чего её KDS, админка и delivery-партнёры живут в одном контуре.

## 2. Карта сервисов
```
[Site / PWA]──┐
[QR /bite/*]──┼──► /api/order /api/scan /api/lead /api/deck        (public, rate-limited)
[WhatsApp]────┘         │
                        ▼
                  PostgreSQL (Prisma)
                        │  Outbox (event bus)
        ┌───────────────┼───────────────────────┐
        ▼               ▼                       ▼
  /api/kds/stream   Nile Admin v2          jobs (cron):
  (SSE на кухню)    (live-ленты, Risk)     sla-breach, points, winback
        ▲
[KDS-экран точки]── /api/auth/login (role=kitchen, long-lived token)

[Paymob] ──► /api/webhooks/paymob (HMAC-verify) ──► order_paid / order_cancel
[Vercel cron 5m] ──► /api/cron/sla ──► sla_breach / points_earned intents
```

## 3. Auth и роли
| Роль | Кто | Доступ |
|---|---|---|
| `admin` | head office | все stores (через явный ?storeId=), создание точек и invite |
| `manager` | директор точки | своя точка: продажи, staff, inventory, Risk |
| `kitchen` | кухня | только KDS своей точки (SSE + bump/fire) |

- JWT HS256 (`jose`), 12 h для людей, `?long=1` = 30 дней для KDS-экранов.
- Пароли: bcrypt; сид staff создаётся админом при онбординге точки.
- **Тенант-гард `scopeStore()`**: сотрудник никогда не может запросить чужую точку; admin обязан передать storeId явно. Все store-scoped роуты идут только через него.

## 4. Мультитенант точек
Каждая сущность несёт `storeId` (orders, scans, staff, invites, outbox).
Публичные роуты резолвят точку по slug/QR-парам (`NB-{sku}-{batch}-{storeSlug}`),
не по доверию к клиенту. QR-партия (batch A/B/C) позволяет A/B-ить упаковку и мерить каналы.

## 5. Event bus (Outbox)
- Продюсеры пишут событие в таблицу `Outbox` в той же транзакции, что и изменение заказа → нет потерянных событий.
- Консьюмеры: KDS SSE (poll 1.5 s), админ-ленты, jobs.
- Апгрейд-путь: 1–10 точек — polling; 10–50 — PG LISTEN/NOTIFY; 50+ — Redis Streams + отдельные воркеры.

## 6. Подключение ресторана (onboarding flow)
```
1. Франшиза подписана ──► admin: POST /api/stores            → store(live=false) + invite NB-INV-XXXX (14 дн)
2. Точка открывает inviteUrl ──► POST /api/stores/[slug]/onboard
       часы, зоны доставки, partnerIds (talabat/elmenus), меню-слаги
       → QR-линки на партию A по каждому SKU + статус ready-for-qa
3. Mystery-shopper QA (SOP из франшиз-пака) ──► admin flip live=true
4. Точка живёт: заказы (site/WA/partners) → KDS SSE → статусы → scan-CRM → points
5. Новая партия упаковки / новый город → новый batch/slug, старый QR не ломается (batch в ссылке)
```
Правило: **точка не принимает заказы, пока live=false** — checkout сайта отдаёт 409 store-not-live.

## 7. Платежи и вебхуки
- Paymob (EG cards/wallets): клиент создаёт order → gateway session → webhook `PAID/FAILED` с HMAC-SHA256 (`timingSafeEqual`).
- FAILED → order CANCELLED + событие в Risk (payment fails).
- Cash/wallet: статус ставит менеджер/KDS вручную, webhook не нужен.
- Идемпотентность: webhook обрабатывается по unique payRef; повторные доставки события безопасны.

## 8. Jobs (cron)
| Job | Расписание | Что делает |
|---|---|---|
| sla | 5 min | NEW/PREP >12 min → sla_breach (Risk + compensate-offer) |
| points | 5 min | DONE без ledger → points_earned intent (consumer начисляет по phone→member) |
| winback | daily | 30+ дней без визита → winback-оффер (WhatsApp template) |
| waste | daily | списания точки → waste% в Risk (порог >3% алерт) |

## 9. Безопасность
- Rate-limit: public 10 r/min/ip; auth 5 r/min/ip + lockout 15 min после 5 фейлов.
- Webhook: только HMAC; секреты в env; ротация раз в квартал.
- PII (phone, name): шифрование at-rest на уровне PG + маска в админ-UI (••• •• 44).
- Consent: marketing/analytics-события пишутся только при nb-consent=1 (ConsentLog — источник истины).
- Аудит: все admin-действия (flip live, price change, stage lead) → Outbox type `audit_*`.

## 10. Порядок реализации (стыкуется с 6-недельным ранбуком PRODUCTION.md)
1. W1: миграции (Staff/StoreInvite/Outbox), auth login, seed admin.
2. W2: stores create/invite + onboard-страница (Next-форма поверх API).
3. W3: paymob webhook + order status machine (NEW→PREP→READY→DONE/CANCELLED) + emit-события.
4. W4: KDS SSE-экран (React EventSource) + cron sla/points.
5. W5: админ v2 читает Outbox вместо localStorage; миграция демо-мостов.
6. W6: load-test SSE (300 экранов), аудит тенант-гарда, runbook инцидентов.

## 11. Клиенты операционного контура (реализованы в скелете)
- **/kds** (`src/app/kds/page.tsx`): full-screen кухонный дисплей — логин с 30-дневным токеном, EventSource на /api/kds/stream (?token= фолбэк, т.к. EventSource не умеет заголовки), колонки NEW → COOKING → READY, живые таймеры (green/amber/red + pulse на breach), BUMP/FIRE через PATCH /api/orders/[id]/status, шапка с queue/avg/breach.
- **/onboard/[slug]** (`src/app/onboard/[slug]/page.tsx` + form.tsx): страница самo-активации точки — invite-код, часы, зоны доставки, partner-URLs, меню на запуск → POST onboard → экран «Ready for QA» со списком QR-партии A и next-steps.
- **Машина статусов** (`/api/orders/[id]/status`): NEW→PREP→READY→DONE + CANCELLED из NEW/PREP; kitchen не может закрывать/отменять; каждый переход emit'ит order_status в Outbox (KDS и админки получают события).

## 12. Nile Admin v2 (страницы поверх API, W5)
- `/admin/login` — web-логин stafа (cookie httpOnly `nb-token`); middleware верифицирует JWT на всём `/admin/*` (admin|manager).
- `/admin` Sales: KPI дня из Prisma (orders, revenue, avg, top product из items Json, scans, cancels с порогом 2%), почасовой бар-чарт, **LiveFeed** (SSE Outbox: order_new/status/paid/cancel, sla_breach, store_live, points).
- `/admin/orders`: таблица с фильтрами статусов и поиском (search params, серверный рендер).
- `/admin/risk`: отмены, SLA-брэчи из Outbox, жалобы 1–2★ из Scan, refund-интенты (paid+cancelled).
- `/admin/stores`: пайплайн подключения точек (INVITED → READY FOR QA → LIVE) + клиент CreateStore (POST /api/stores → invite).
- `/admin/leads`: франшизный пайплайн со сменой стадий инлайн (PATCH /api/leads/[id] → emit lead_stage).
- `/admin/club`: Nile Club + scan-CRM: members, points ledger, repeat rate, QR-воронка, referrals.
- Дизайн-токены те же (tailwind.config), UX-паттерны унаследованы от концепт-админки без редизайна.

*Концепт-админка (admin.html) остаётся витриной UX; прод-админка строится поверх этих API без редизайна.*
