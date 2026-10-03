# NILE Bites — проект полного цикла
> Start here: **PROJECT-PASSPORT.md** → сдача команде: **HANDOVER.md** · развёртывание: **DEPLOY.md** · карта файлов: **STRUCTURE.md** · навигатор: **HUB.html**

## Дизайн-концепт сайта

**Смотри:** `index.html` — живой self-contained прототип главной страницы (desktop + mobile + EN/AR).
Открывается двойным кликом, работает офлайн: шрифты (Anton, Archivo, Cairo) и все 12 фото вшиты base64.

**Читай:** `SPEC.md` — полная дизайн-спецификация / ТЗ (сетка, токены, тексты, состояния, адаптив, RTL, роадмап).

## Структура
```
index.html      готовый концепт сайта (4.6 MB, офлайн)
admin.html      NILE ADMIN — концепт админки (PIN 2026, офлайн): 11 разделов, вкл. Risk & Exceptions (отмены, рефанды, waste, жалобы, SLA, churn)
src/            исходники: index.html + styles.css + app.js (токены @@IMG/@@FONT)
build.py        сборка: оптимизация фото → base64 → index.html
qa_shots.py     playwright-скриншоты состояний (desktop / mobile / RTL)
img/            сгенерированный фуд-стайл, упаковка, основатель, реальное фото товара
franchise-kit/  NileBites-Franchise-Deck.pdf (10 слайдов, вшит в гейт сайта) + brand-board.jpg
FUTURE.md       NILE LAB: horizon-map 2027–2030; H1+H2+H3 демо вкатаны: сайт #lab (Genius/Save/AR/NFC/voice/Pass/robot/IoT/taste/ticket/ledger), админка AI/Marketing/Stores
brand/          BRANDBOOK.md (айдентика, ToV, фото-стиль) + CONTENT-PLAN.md (30 дней TikTok/IG)
make_deck.py    генератор франшизного дека (чистый python, без зависимостей)
make_pitch.py   investor one-pager (1 стр.) + pitch deck 2026 (12 слайдов)
make_lab_book.py  LAB Showcase PDF (22 стр., скрины 19 демо)
FINAL.md        финальная сводка проекта (18 раундов, передача)
Makefile        make site/deck/tokens/shots/regress/serve/clean
serve.py        dev-сервер :8000 с авто-пересборкой src/*
tokens.py       экспорт дизайн-токенов → tokens/tokens.json + tokens.css
HUB.html        страница-навигатор по артефактам проекта
site.webmanifest, sw.js, icon-*.png   PWA-слой концепта
production/     Next.js-скелет продакшена: Prisma PG, Sanity CMS, API, CI, runbook
fonts/          Anton, Archivo Black, Archivo var, Cairo var
shots/          QA-скриншоты
```

## Быстрый старт
0. `HUB.html` — навигатор по всем артефактам проекта (открой в браузере).
1. `make serve` → http://localhost:8000 — dev-сервер с **авто-пересборкой** при правке `src/*`.
   Или вручную: правь `src/*` → `make site` → открой `index.html`.
2. `make regress` — финальный регресс (4 режима + контактные листы + отчёт).
3. Остальные команды: `make help` (site/deck/tokens/shots/regress/serve/clean).

## Что внутри прототипа
- Интро «Нил → крокодил → NILE BITES → TASTE THE NILE» (skip / click / reduced-motion).
- Hero с дыханием кадра, тикером слоганов, ORDER NOW / EXPLORE MENU.
- ONE CUP. MANY FLAVOURS. с орбитой ингредиентов.
- MEET THE BITES: 5 карточек, TRY IT → подставляет начинку в конструктор.
- BUILD YOUR CUP: live-SVG стакана, цены в EGP, ADD TO ORDER.
- SAUCE CHANGES EVERYTHING, BORN BY THE NILE (параллакс), туристический блок.
- FIND YOUR NILE: SVG-карта Египта, пины, карточка точки (OPEN NOW по часам).
- Лента 9:16, packaging + THE NILE SYSTEM + QR «YOUR BITE» (рейтинг, очки).
- FRANCHISE (WHAT YOU GET, BUILT TO SCALE, форма), NILE CLUB + referral.
- основатель **Alla Miller** со стаканом Nile Bites: бейдж FOUNDER + неймплейт в туристическом блоке;
- реальные фото товара и бренд-борды: кадр `REAL` в ленте, бренд-борд упаковки в PACKAGING;
- EN | العربية: полный RTL, Cairo 900, египетский регистр копирайта.
- Мобайл: бургер-меню, рельсы, sticky ORDER NILE с живой ценой;
- quick wins раунда 2: WhatsApp-FAB с префаком из конструктора, talabat/elmenus, аллергены+VEG/SPICY+Kcal+фильтры, JSON-LD+hreflang, franchise FAQ + gate «GET THE DECK» (PDF-стаб).

*© 2026 Nile Bites · design concept — not a live store.*
