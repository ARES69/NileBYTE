# NILE BITES — СТРУКТУРА ПРОЕКТА (СКЕЛЕТ)
### v1.0 · 30.09.2026 · полное дерево с аннотациями · читать вместе с HUB.html и HANDOVER.md
### Регенерация голого дерева: `find . -type f -not -path "*/node_modules/*" -not -path "*/.next/*" -not -path "./shots/*" | sort`

---

## 0. Пять слоёв проекта
```
┌─ DOCS      : README, PASSPORT, HANDOVER, DEPLOY, SPEC, NEXT, HOWTO, STRUCTURE (этот файл)
├─ CONCEPT   : index.html + admin.html (self-contained офлайн-артефакты) ← собираются из src/
├─ KITS      : franchise-kit/ (3 PDF + борд), brand/ (бренд-бук, контент-план), tokens/
├─ PRODUCTION: production/ — Next.js 15 + Prisma + Sanity + CI + ранбуки  ← сюда идёт W1–W6
└─ QA/TOOLS  : Makefile, build/serve/regress/qa/make_deck/make_pitch/tokens.py, shots/
```
Правило слоёв: **CONCEPT правим только через src/ + build.py; PRODUCTION — руками; DOCS/KITS — генераторами или руками; QA не трогаем руками кроме добавления тестов.**

---

## 1. Корень `nilebites/`
```
nilebites/
├── README.md                  вход: указатель на PASSPORT/HANDOVER/DEPLOY/HUB
├── PROJECT-PASSPORT.md        паспорт: числа, архитектура, правила бренда, roadmap-статус
├── HANDOVER.md                сдача команде: карта артефактов, день 1, роли, ADR, риски
├── DEPLOY.md                  развёртывание: LOCAL / DOCKER-DEV / PROD + rollback + траблшутинг
├── SPEC.md                    ТЗ концепта: токены §2, секции §5, состояния §9, логи раундов §13.1–13.17
├── NEXT.md                    research-бэклог P0–P2 с 25 источниками и ✅-статусами
├── HOWTO.md                   рецепты правок концепта (текст/цена/фото/город/языки)
├── STRUCTURE.md               ← этот файл: дерево и слои
├── HUB.html                   навигатор-дашборд по всем артефактам (открывать в браузере)
│
├── index.html                 ★ КОНЦЕПТ-САЙТ (5 MB, офлайн): 20+ секций, EN/AR/RU, checkout, QR, PWA
├── admin.html                 ★ КОНЦЕПТ-АДМИНКИ (PIN 2026): 12 разделов incl. Risk + KDS
├── site.webmanifest           PWA-манифест концепта
├── sw.js                      service worker (offline-shell, cache-first)
├── icon-192.png / icon-512.png PWA-иконки (gold Nile-wave на black)
│
├── src/                       ИСХОДНИКИ концепта (править только здесь!)
│   ├── index.html             разметка + тексты data-en/ar/ru + @@IMG/@@FONT токены
│   ├── styles.css             дизайн-система + все секции + адаптив + RTL + WCAG-фиксы
│   ├── app.js                 i18n, интро, конструктор, карта, checkout, мосты в API/localStorage
│   ├── admin.html / admin.css / admin.js   исходники концепт-админки
│   └── deck-pdf.b64           base64 стаба дека (исторически; теперь дек настоящий из franchise-kit)
│
├── build.py                   сборщик: оптимизация img → base64, шрифты, @@токены → index.html + admin.html
├── serve.py                   dev-сервер :8000 с авто-пересборкой по mtime src/*
├── regress.py                 финальный регресс: 4 режима × секции + проверки + контактные листы
├── qa_shots.py                точечные скриншоты состояний (desktop/mobile/RTL)
├── make_deck.py               генератор Franchise Deck (10 слайдов, pure python PDF)
├── make_pitch.py              генератор Investor One-Pager (1 стр.) + Pitch Deck (12 слайдов)
├── tokens.py                  экспорт дизайн-токенов → tokens/
├── Makefile                   make site|deck|tokens|shots|regress|serve|clean
│
├── img/                       фото-ассеты концепта (16 файлов, вшиваются в index.html)
│   ├── hero-cup.jpg           hero: рука со стаканом / Каир, Нил, вечер
│   ├── bite-{kofta,shawarma,shatta,cheese,shrimp}.jpg   продуктовые карточки 1:1
│   ├── nile-sunset.jpg        BORN BY THE NILE (параллакс)
│   ├── founder-cup.jpg        Алла Миллер со стаканом (AI-редакт founder-original.jpg)
│   ├── founder-original.jpg   исходный портрет основателя
│   ├── product-street.jpg     реальное фото товара с улицы (REAL-кадр ленты)
│   ├── packaging-board.jpg    бренд-борд упаковки (чёрно-золотой, Eye of Horus)
│   ├── packaging.jpg          flat-lay упаковки (ранняя версия)
│   ├── tourist.jpg            турист-кадр (заменён founder-cup в турист-блоке)
│   └── social-{1,2,3}.jpg     вертикальные кадры ленты 9:16
│
├── fonts/                     Anton, Archivo Black, Archivo var, Cairo var (вшиваются base64)
├── tokens/                    tokens.json (W3C-ish) + tokens.css (--nb-*) — handoff в Figma/код
├── franchise-kit/
│   ├── NileBites-Franchise-Deck.pdf        10 слайдов (вшит в гейт /franchise)
│   ├── NileBites-Investor-OnePager.pdf     1 страница (вшита в investor room)
│   ├── NileBites-Pitch-Deck.pdf            12 слайдов problem→ask
│   └── brand-board.jpg                     борд айдентики упаковки (источник дека)
├── brand/
│   ├── BRANDBOOK.md           знаки, палитра 45/25/15/10/5, type EN/AR/RU, ToV, фото §6, motion, DO/DON'T
│   └── CONTENT-PLAN.md        30 дней TikTok/IG по неделям + KOL + метрики-пороги
├── shots/                     QA-доказательства (51 MB): регресс-листы, мост 110–111, обзоры раундов
└── production/                ← СЛЕДУЮЩИЙ РАЗДЕЛ
```

---

## 2. `production/` — продакшен-скелет (Next.js 15)
```
production/
├── README.md                  bootstrap + структура + правила репо (5 правил)
├── package.json               next 15.5.4, react 19, framer-motion, next-intl, prisma, jose, bcryptjs, zod
├── package-lock.json          локдаун зависимостей для CI
├── next.config.mjs            withNextIntl(plugin) + AVIF/webp + security-заголовки
├── vercel.json                crons (sla/points/winback/waste) + SSE/PDF-заголовки
├── tsconfig.json              strict, paths @/*
├── tailwind.config.ts         токены 1:1 из SPEC §2 (colors/fonts/radii/keyframes/easings)
├── postcss.config.mjs         tailwind + autoprefixer
├── docker-compose.yml         PG16 (:5432) + Adminer (:8081) для dev
├── .env.example               шаблон секретов (PG, Sanity, Paymob, WA, GA4/Matomo, Sentry)
├── .env.local                 локальные значения (не коммитим!)
│
├── prisma/
│   ├── schema.prisma          13 моделей + 4 enum'а (Store…Outbox) — контракт данных
│   ├── seed.ts                baseline: 5 продуктов, 6 точек, 3 staff (bcrypt)
│   └── migrations/0001_init/  migration.sql (264 строк, 13 CREATE TABLE) + lock
│
├── cms/schema.ts              Sanity-типы: product, store, sauce, socialClip, faq, pageSeo (en/ar/ru поля)
├── sanity.config.ts           Studio-конфиг (деплой студии отдельно)
├── sanity.cli.ts              CLI-конфиг проекта/датасета
│
├── src/
│   ├── middleware.ts          next-intl routing + JWT-гард /admin/* (кроме login)
│   ├── i18n/routing.ts        defineRouting (locales en/ar/ru, prefix as-needed)
│   ├── i18n/request.ts        getRequestConfig: messages из src/messages/*.json
│   ├── messages/{en,ar,ru}.json   340 ключей, портированы автоматом из концепта (scripts/extract-messages.py)
│   ├── lib/
│   │   ├── pricing.ts         PRICING/SAUCES/SIZES/TOPS + quote() + zod CupSchema — единый ценник
│   │   ├── i18n.ts            locales, isRtl, hreflangAlternates, fontStacks
│   │   ├── motion.ts          Framer-токены: интро-таймлайн, hero/reveal/marquee, easings
│   │   ├── auth.ts            JWT (jose) + роли admin/manager/kitchen + scopeStore() тенант-гард
│   │   ├── events.ts          Outbox event bus: emit()/readAfter()
│   │   ├── cors.ts            preflight()+jres() для публичных демо-роутов
│   │   └── db.ts              Prisma-синглтон
│   ├── components/
│   │   ├── Intro.tsx          интро «Нил→крокодил→NILE BITES» на framer-motion
│   │   ├── Hero.tsx           hero-остров (photo stage, NILE/BITES контур, CTA)
│   │   ├── OrderBar.tsx       липкая ORDER-панель (85vh → footer)
│   │   ├── Consent.tsx        cookie-баннер с preferences (necessary/marketing/analytics)
│   │   └── admin/
│   │       ├── LiveFeed.tsx   SSE-лента Outbox для Admin v2
│   │       └── CreateStore.tsx  клиент создания точки + invite
│   ├── app/
│   │   ├── [locale]/          ★ все page-роуты под локалью (en/ar/ru пререндерены)
│   │   │   ├── layout.tsx     html lang/dir, local-fonts, JSON-LD Restaurant, NextIntlProvider
│   │   │   ├── globals.css    tailwind + @layer компоненты (.wrap/.display/.btn-*/.chip/.card)
│   │   │   ├── page.tsx       карта home-секций по SPEC §5 с TODO-якорями
│   │   │   ├── admin/         Admin v2: layout(JWT-shell), login, sales, orders, risk, stores, leads, club
│   │   │   ├── kds/page.tsx   кухонный дисплей: SSE, колонки NEW/COOKING/READY, таймеры, BUMP/FIRE
│   │   │   ├── bite/[qr]/     QR-лендинг YOUR BITE (scan→rate→points→refer)
│   │   │   ├── locations/[slug]/  per-store SSG: часы, зоны, партнёры, NAP
│   │   │   └── onboard/[slug]/    self-activation точки: invite→часы/зоны/партнёры/меню→QR-партия A
│   │   ├── api/
│   │   │   ├── auth/login/        JWT + httpOnly cookie (12h / 30d для KDS)
│   │   │   ├── order/             checkout: zod CupSchema → quote → Order + emit order_new
│   │   │   ├── orders/[id]/status/ машина статусов NEW→PREP→READY→DONE/CANCEL + роль-гарды
│   │   │   ├── scan/              QR-сканы: repeat по device, звёзды, batch
│   │   │   ├── lead/ + deck/      франшиз-лиды и гейт дека (логирование скачиваний)
│   │   │   ├── leads/[id]/        PATCH стадии пайплайна (admin)
│   │   │   ├── stores/            GET список / POST create+invite (admin)
│   │   │   ├── stores/[slug]/onboard/  активация точки + QR-линки партии
│   │   │   ├── kds/stream/        SSE из Outbox (poll 1.5s; ?token= фолбэк для EventSource)
│   │   │   ├── webhooks/paymob/   HMAC-SHA256 verify → order_paid/order_cancel
│   │   │   ├── cron/sla/          5-min cron: SLA-брэчи + points-интенты
│   │   │   └── health/            uptime-проба (DB round-trip)
│   │   ├── manifest.ts        PWA-манифест прода
│   │   ├── robots.ts          robots.txt (disallow /admin, /bite/, /api/)
│   │   ├── sitemap.ts         статики ×3 локали + live-точки
│   │   └── opengraph-image.tsx  OG 1200×630 генерится на билде
│   └── types/shims.d.ts       типы-шимы Sanity Studio (студия вне web-билда)
│
├── scripts/
│   ├── w1.sh                  bootstrap дня 1: install→migrate→seed→lint→build→smoke
│   ├── extract-messages.py    порт data-en/ar/ru концепта → src/messages/*.json
│   └── dbtools/               лёгкие seed.mjs / smoke.mjs на pg+bcryptjs (без ORM) + их node_modules
│
├── tests/e2e/smoke.spec.ts    playwright-smokes: home/order-api/qr/store
├── docs/
│   ├── PRODUCTION.md          ранбук: стек, роуты, контракт данных, комплаенс, rollout W1–W6, §6.5–6.7 proof
│   ├── BACKEND.md             архитектура: auth/tenancy/Outbox/SSE/webhooks/onboarding точек §6–12
│   └── W1-KICKOFF.md          покассовый план недели 1 + gate в W2 + риски
└── .github/
    ├── workflows/ci.yml       lint → build(PG-сервис) → e2e(playwright) → deploy(Vercel)
    └── SECRETS.md             чек-лист секретов и DNS-записей
```
*(node_modules/, .next/, scripts/dbtools/node_modules/ — устанавливаемые, в дерево не входят.)*

---

## 3. Потоки данных (кто кому пишет)
```
CONCEPT index.html ──(CORS apiPost, фолбэк localStorage)──► api/order|scan|lead|deck ──► PostgreSQL
CONCEPT admin.html ◄──(localStorage nb-*)── concept-мост (демо)         │
                                                                        ▼
PROD site /[locale] ──► api/order ──► Order + Outbox(order_new) ──► /api/kds/stream ──► /kds экран
PROD /admin v2 ◄── Prisma-чтения (Sales/Orders/Risk/Stores/Leads/Club) + SSE LiveFeed
Paymob ──webhook──► api/webhooks/paymob ──► order_paid/cancel ──► Outbox
Vercel cron ──► api/cron/sla ──► sla_breach / points_earned ──► Outbox ──► Admin Risk / Loyalty
QR на стакане ──► /bite/[qr] ──► api/scan ──► Scan(repeat, stars) ──► Marketing/Investor-метрики
```

## 4. Generated vs Source (не редактируй сгенерированное)
| Артефакт | Генерируется | Источник правок |
|---|---|---|
| index.html, admin.html | build.py | src/* |
| tokens/tokens.* | tokens.py | SPEC §2 / BRANDBOOK |
| franchise-kit/*.pdf | make_deck.py / make_pitch.py | тексты внутри скриптов |
| src/messages/*.json | scripts/extract-messages.py | data-* атрибуты концепта |
| prisma/migrations/* | prisma migrate | schema.prisma (новой миграцией!) |
| shots/* | regress.py / qa_shots.py | — (доказательства) |
| production/public/fonts|icons | копирование из ../fonts, ../icon-* | — |

## 5. Быстрая навигация по задачам
| Задача | Куда |
|---|---|
| Поменить текст/цену/фото концепта | HOWTO.md → src/index.html, src/app.js, img/ → make site |
| Править дизайн-токены | src/styles.css :root + tailwind.config.ts + tokens.py (синхронно) |
| Новый API-роут | production/src/app/api/** + zod + emit в Outbox + тест в smoke.spec |
| Новая секция home | production/src/app/[locale]/page.tsx TODO-якорь + SPEC §5 как ТЗ |
| Подключить точку | /admin/stores → invite → /onboard/[slug] → QA → live=true (BACKEND §6) |
| Деплой | DEPLOY.md треки 1–3 + vercel.json + SECRETS.md |
| Регресс UX | make regress → shots/regress-*.jpg |

*© 2026 Nile Bites · structure map · not a live store.*
