# NILE BITES — ПАСПОРТ ПРОЕКТА
### v1.0 · 29.09.2026 · концепт → продакшен-скелет · статус: готов к 6-недельному rollout

---

## 1. Что это
Международный food-бренд египетской street food-культуры: **горячие дамплинги в стакане, 4 соуса, формат made-to-go**.
Проект поставлен целиком: от цифровой идентичности (интро «Нил → крокодил») до серверного контура с подключением точек и франшиз-пайплайна.
Платформа бренда: **TASTE THE NILE.** · Дескриптор: Egyptian Street Food. Made to Go. · Дерзкий: One bite. You're in.

## 2. Артефакты (что смотреть в первую очередь)
| Артефакт | Где | Что внутри |
|---|---|---|
| Концепт сайта | `index.html` (5 MB, офлайн) | все 41 пункт брифа + P0/P1/P2: checkout, карта, QR, EN/AR/RU, PWA |
| Концепт админки | `admin.html` (PIN 2026) | 12 разделов: Sales…Franchise + Risk + KDS; live-заказы, CSV |
| Навигатор проекта | `HUB.html` | все ссылки, статусы, команды |
| Франшизный дек | `franchise-kit/NileBites-Franchise-Deck.pdf` | 10 слайдов; вшит в гейт сайта |
| Investor one-pager | `franchise-kit/NileBites-Investor-OnePager.pdf` | 1 стр.; вшит в investor room |
| Питч-дек | `franchise-kit/NileBites-Pitch-Deck.pdf` | 12 слайдов problem→ask |
| Бренд-бук | `brand/BRANDBOOK.md` | знаки, палитра 45/25/15/10/5, ToV EN/AR/RU, фото-стиль, DO/DON'T |
| Контент-план | `brand/CONTENT-PLAN.md` | 30 дней TikTok/IG + KOL + метрики |
| Спека | `SPEC.md` | токены, секции §5, состояния, логи раундов §13.1–13.16 |
| Бэклог | `NEXT.md` | research P0–P2 с 25 источниками, всё ✅ кроме прод-шагов |
| Продакшен | `production/` | Next.js 15, Prisma PG, Sanity, 12 API-роутов, admin v2, KDS, CI |
| Ранбуки | `production/docs/PRODUCTION.md`, `BACKEND.md` | rollout 6 недель; бэкенд + onboarding точек |

## 3. Ключевые числа модели (концепт-стадия, честно помечены)
Orders/day 300 · Avg check 114 EGP · Revenue/store 1.03M EGP/мес · GM 63% · EBITDA 18–22% ·
Payback 3–8 мес · Инвестиция 50–150k USD по форматам · Royalty 5% + fund 2% ·
Цены стаканов: 125–175 EGP (12 bites), размеры 8/12/18 · Delivery 20 EGP, free >300 ·
Пороги риска: cancel <2%, waste <3%, SLA <12 min, ad freq cap 4.

## 4. Архитектура одной строкой
Site/PWA/QR/WhatsApp → **Next.js API (zod)** → **PostgreSQL (Prisma)** → **Outbox events** → KDS SSE / Admin v2 / jobs(cron) ← Paymob webhooks; контент — **Sanity**; точки подключаются invite→onboard→QA→live; данные сканов = owned CRM.

## 5. Что проверено автоматом
- Регресс концепта: 4 режима (desktop/mobile/AR-RTL/RU) × все секции + модалки — **ALL GREEN** (0 page errors, 0 console errors, 0 broken imgs, 0 h-overflow); листы `shots/regress-*.jpg`, скрипт `regress.py`.
- Интеракции кликами: checkout+promo+points, QR-рейтинг, club OTP, gift-код, investor-гейт, UGC-права, заявки, мост сайт→админка, KDS-таймеры, SSE-фид.
- PDF-артефакты: 10/1/12 страниц, извлекаемый текст проверен.

## 6. Как работать с репозиторием
```
make serve      # :8000 + авто-пересборка концепта при правке src/*
make site|deck|tokens|shots|regress|clean
# концепт правим ТОЛЬКО в src/ (index.html, styles.css, app.js, admin.*), корневой index.html — артефакт сборки
# прод: production/ → npm i → prisma migrate → npm run dev (ранбук: docs/PRODUCTION.md W1–W6)
```
Редактурные рецепты: `HOWTO.md`. Токены для Figma: `tokens/tokens.json|css`.

## 7. Роадмап: сделано / осталось
**Сделано (100% концепт-слоя):** сайт по брифу 1–41 · основатель и реальные фото товара · quick wins P0 (WA, talabat/elmenus, аллергены, SEO-schema, франшиз-funnel) · мост сайт↔админ · Nile Club onboarding · дек/one-pager/питч · бренд-бук/контент-план · P2 (UGC, careers, gifts, investor, PWA) · convenience-пакет (HUB, Makefile, serve, tokens, deep-links) · негативный контур (Risk, KDS) · бэкенд-скелет (auth/tenancy/outbox/SSE/webhooks/cron) · admin v2 · онбординг точек.
**W1-ready пакет:** миграция 0001_init (13 таблиц), seed, messages-порт, i18n-routing, Sanity config, /api/health, w1.sh, SECRETS.md, W1-KICKOFF.md с gate-критериями.
**Postgres проверен вживую (pre-W1):** PG15 + миграция + seed + smoke-контур (заказ→outbox→points→scan→cancel→SLA→read-back метрик) — зелёный; docker-compose для команды.
**API-контур прогнан против живой БД (pre-W1):** build 30 роутов + login/stores/onboard/order/status-machine/scan/cron/lead/SSE — все ответы как задумано; SSE тикает событиями Outbox.
**Мост концепт↔бэкенд (demo):** checkout/scan/lead/deck концепта пишут в живую PG через CORS-API (фолбэк offline-демо); заказ NB-7012 прошёл путь сайт→PG→Admin v2 (shots/110–111); i18n прода отрефакторен под app/[locale] (en/ar/ru пререндерены).
**Осталось (люди + прод-недели):** исполнение W1–W6 ранбука (порт секций в компоненты, messages json, Paymob prod, WA Cloud, QR-тираж, load/a11y/SEO-аудиты, CDN/AVIF, Sentry); египетский копирайтер AR; фуд-съёмка по BRANDBOOK §6; юрист (Privacy/Terms/оферта, EG DPL 151/2020, halal-доки); юрлицо + ТЗ + домен + SSL; фактические цифры флагмана в деки после 4–8 недель торговли.

## 8. Команда и роли (для питча)
Founder/brand/product — **Alla Miller** (лицо бренда, host концепта) · Ops/store P&L — store manager (най W6) · Content/UGC — marketing lead (най W2) · Supply/SOP — ops lead (най W4) · Tech — этот репозиторий + 1 fullstack на rollout.

## 9. Правила бренда, которые нельзя ломать
1. Не раскрывать финмодель на публичном сайте (только гейты под NDA). 2. AR = египетский разговорный, не MSA. 3. Один gold-CTA на экран. 4. Zero greenwashing: эко-заявления только с документами. 5. UGC-репосты только с правами. 6. Точка не торгует до live=true (QA). 7. Негативные метрики в админке обязательны рядом с позитивными.

*© 2026 Nile Bites · design concept & production skeleton · not a live store · hello@nilebites.com*
