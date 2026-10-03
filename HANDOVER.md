# NILE BITES — HANDOVER / СДАЧА ПРОЕКТА
### v1.0 · 30.09.2026 · для команды, подрядчиков и инвесторов · читается за 15 минут

---

## 0. TL;DR
Nile Bites — food-бренд египетской street food (дамплинги в стакане, 4 соуса, made-to-go).
Поставлено: **концепт-сайт 100% брифа** (EN/AR/RU, checkout, QR-CRM, PWA) · **админка с Risk и KDS** · **франшиз- и инвест-кит** (3 PDF) · **бренд-бук и контент-план** · **продакшен-скелет** (Next.js 15 + PostgreSQL + Sanity + CI) · **живой бэкенд-контур, проверенный e2e** (сайт → API → PG → Admin/KDS).
Готовность: **W1 rollout можно стартовать в понедельник** по `production/docs/W1-KICKOFF.md`.

---

## 1. Карта артефактов (что где лежит)
| Путь | Что это | Кому |
|---|---|---|
| `PROJECT-PASSPORT.md` | паспорт: числа, архитектура, правила бренда | всем, входная точка |
| `HUB.html` | навигатор по артефактам со статусами | всем |
| `STRUCTURE.md` | полное дерево проекта с аннотациями и потоками данных | всем, особенно новичкам |
| `index.html` | концепт-сайт (офлайн, 5 MB): все секции брифа | дизайн/фронт/маркетинг |
| `admin.html` | концепт-админки (PIN **2026**): 12 разделов, Risk, KDS | ops/аналитика |
| `src/` + `build.py` | исходники концепта + сборка (base64-инлайн) | фронт |
| `Makefile`, `serve.py`, `regress.py`, `qa_shots.py` | тулинг: make site/deck/tokens/shots/regress/serve | фронт/QA |
| `tokens/` | tokens.json/css — дизайн-токены для Figma и кода | дизайн |
| `brand/BRANDBOOK.md` | айдентика, ToV EN/AR/RU, фото-стиль, DO/DON'T | дизайн/SMM/подрядчики |
| `brand/CONTENT-PLAN.md` | 30 дней TikTok/IG + KOL + метрики | SMM |
| `franchise-kit/*.pdf` | Franchise Deck (10), Investor One-Pager (1), Pitch Deck (12) | B2B/инвесторы |
| `franchise-kit/brand-board.jpg` | борд айдентики упаковки (исходник дека) | дизайн |
| `SPEC.md` | ТЗ концепта: токены, секции §5, логи раундов §13 | фронт/QA |
| `NEXT.md` | research-бэклог P0–P2 с 25 источниками, статусы ✅ | продукт |
| `HOWTO.md` | рецепты правок концепта (текст/цена/фото/город) | все, кто правит |
| `production/` | Next.js 15 скелет: API, Prisma, Sanity, admin v2, KDS, CI | бэк/фронт |
| `production/docs/PRODUCTION.md` | ранбук: стек, роуты, комплаенс, rollout W1–W6 | tech lead |
| `production/docs/BACKEND.md` | бэкенд: auth/tenancy/Outbox/SSE/webhooks/onboarding точек | бэк |
| `production/docs/W1-KICKOFF.md` | покассовый план недели 1 с gate-критериями | tech lead/PM |
| `DEPLOY.md` + `production/vercel.json` | инструкция развёртывания: local/docker/prod, crons, SSE-заголовки, rollback | devops |
| `.github/SECRETS.md` | чек-лист секретов и DNS | devops |
| `shots/` | QA-доказательства: регресс-листы 4 режимов, мост 110–111 | QA |

---

## 2. Запуск всего стека локально (10 минут)
```bash
# 1) Postgres (вариант А: docker)
cd production && docker compose up -d          # PG16 :5432 + Adminer :8081
#    (вариант Б: локальный PG15 как в sandbox: service postgresql start; db nilebites/nile/nile)

# 2) Бэкенд + фронт прода
cp .env.example .env.local                     # вписать DATABASE_URL, AUTH_SECRET (openssl rand -hex 32)
bash scripts/w1.sh                             # install → migrate → seed → lint → build → smoke

# 3) Концепт-сайт с live-мостом в API
cd .. && make serve                            # :8000, авто-пересборка src/*
# концепт сам найдёт API на :3000; без API работает offline-демо

# 4) Админки
#    концепт: admin.html (PIN 2026)
#    прод:    http://localhost:3000/admin/login → admin@nilebites.com / Nile#2026 (СМЕНИТЬ!)
```
Dev-учётки seed'а: admin@ / manager.hurghada@ / kitchen.hurghada@ — пароль `Nile#2026` (env SEED_*).

---

## 3. День 1 команды (condensed W1)
1. Devops: Vercel+Neon, секреты по SECRETS.md, DNS nilebites.com+www, SPF/DKIM/DMARC, Sentry.
2. Бэк: `w1.sh` зелёный на стейдже; логин в /admin; создать invite для тест-точки; onboard → QR-партия A.
3. Фронт: перенести 5 продуктов/6 точек из seed+Sanity в home-секции (TODO-якори в `production/src/app/[locale]/page.tsx`, эталон — SPEC §5 и концепт).
4. Контент: вычитать AR с египетским копирайтером (черновик уже в `src/messages/ar.json`, 337 уникальных ключей).
5. QA: прогнать `make regress` на концепте как эталон UX; на проде — smoke `tests/e2e/smoke.spec.ts`.
**Gate в W2:** home на /, /ar, /ru с реальными данными; заказ site→KDS→Outbox→Admin виден end-to-end; Lighthouse mobile LCP<2.5s; axe 0 critical.

---

## 4. Роли и владельцы рабочих потоков
| Поток | Владелец | Опора |
|---|---|---|
| Tech rollout W1–W6 | tech lead (нанять) | PRODUCTION.md, BACKEND.md, W1-KICKOFF.md |
| Бренд/дайджест айдентики | дизайнер-подрядчик | BRANDBOOK.md, tokens/ |
| AR-копирайт | египетский копирайтер (фраза-тест: «بيمشي معاك») | messages/ar.json + BRANDBOOK §5 |
| SMM/контент | content lead (най W2) | CONTENT-PLAN.md |
| Фото-банк | фуд-фотограф, 2 дня/мес | BRANDBOOK §6 (сейчас AI-плейсхолдеры!) |
| Юридика | юрист EG | Privacy (EG DPL 151/2020), Terms, оферта франшизы, halal-доки, anti-greenwashing |
| Франшиз-продажи | founder + franchise dev | Pitch/Deck/One-Pager, /admin/leads, SLA <24h |
| Ops точки | store manager (най W6) | admin v2 Stores/Risk/KDS, SOP из франшиз-пака |

---

## 5. Ключевые решения (ADR-lite) и почему так
1. **Один формат cup** — скорость обучения, фото-геничность, капекс 50–150k; меню = 5 начинок × 4 соуса.
2. **Outbox вместо очереди** на старте: события в той же транзакции → нет потерь; апгрейд PG LISTEN → Redis на 50+ точках.
3. **QR = owned CRM**: сканы дают repeat/quality/каналы без платформенной ренты; batch A/B/C для когорт упаковки.
4. **CORS-мост концепт↔API с offline-фолбэком**: демо живое при любом состоянии бэкенда.
5. **i18n: EN дефолт, AR полный RTL (египетский регистр), RU tourist-layer с фолбэком EN** — сегмент `[locale]`, пререндер.
6. **Негативные метрики обязательны** (Risk/KDS-брэчи/waste/churn): ops-культура без vanity-numbers.
7. **Финмодель не на публичном сайте** — только гейты под NDA (deck/one-pager/data-room).
8. **Zero greenwashing**: эко-заявления только с документами (пункт бренд-прав).
9. **Точка не торгует до live=true** (QA mystery-shopper) — защита бренда на старте сети.
10. **Next.js + Prisma + Sanity + Vercel/Neon** — рынок труда EG/remote, скорость найма.

---

## 6. Риски и mitigations
| Риск | Митигейшн |
|---|---|
| Сезонность Хургады | Каир office-lunch + delivery-микс; формат-микс 60/30/10 |
| Зависимость от talabat/elmenus | WA-канал и own-site с промо NILE10; QR-ретейн |
| Качество смены на точке | KDS-таймеры + SLA-брэчи + mystery-shopper + waste-порог >3% алерт |
| Копирование формата | Бренд-система + data-CRM + скорость сети (franchise playbook) |
| Комплаенс данных (EG DPL/GDPR) | ConsentLog как источник истины; marketing/analytics только при согласии |
| 1 GB RAM sandbox-демо | typecheck вынесен из build; в CI — полный lint+tsc (ci.yml) |

---

## 7. Доказательства качества (приложены)
- Регресс концепта: 4 режима × все секции + модалки — **ALL GREEN** (0 errors/0 broken imgs/0 overflow): `shots/regress-*.jpg`, `regress.py`.
- Live-контур: сайт→PG→Admin (NB-7012): `shots/110-111`; API-прогон 12 эндпоинтов: PRODUCTION §6.6.
- PDF-кит: 10+1+12 страниц, текст извлекаем, бренд-палитра соблюдена.
- tsc --noEmit: 0 ошибок; CI-скелет: lint→build(PG)→e2e→deploy.

---

## 8. Что НЕ сделано сознательно (и когда)
- Платежи prod (Paymob keys) — W3; сейчас sandbox-ветка webhook готова.
- WhatsApp Cloud API номер — W3 (префаки на клиенте готовы).
- Push-купоны PWA и wallet-pass — после 10k членов клуба.
- Investor data-room с фактическими метриками — после 4–8 недель торговли флагмана.
- Merch-drop и UGC-экраны в точках — после месяца UGC-волны.

---

## 9. Контакты проекта (демо-слой)
hello@nilebites.com · franchise@nilebites.com · +20 65 000 0000 · nilebites.com (concept)
Founder: **Alla Miller** (лицо бренда, продукт, хост концепта).

*© 2026 Nile Bites · concept & production skeleton · not a live store · TASTE THE NILE.*
