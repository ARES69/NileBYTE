# NILE BITES — ИНСТРУКЦИЯ ПО РАЗВЁРТЫВАНИЮ
### v1.0 · три трека: LOCAL → DOCKER-DEV → PRODUCTION · время: 10 мин / 15 мин / 1 день
### Связанные доки: `.github/SECRETS.md` (секреты), `docs/W1-KICKOFF.md` (план недели), `docs/BACKEND.md` (архитектура)

---

## Трек 0. Требования
- Node **20+**, npm 10+; git.
- Локально: PostgreSQL 15/16 **или** Docker 24+ (compose).
- Аккаунты (прод): Vercel (Pro не нужен), Neon или RDS PG16, Sanity (free tier), Paymob **sandbox**, домен nilebites.com с доступом к DNS.
- Секреты генерим так: `openssl rand -hex 32` (AUTH_SECRET, CRON_SECRET).

---

## Трек 1. LOCAL (песочница/ноутбук без docker) — 10 минут
```bash
# 1. Postgres (Debian/Ubuntu)
sudo apt-get install -y postgresql postgresql-client
sudo service postgresql start
sudo -u postgres psql -c "CREATE ROLE nile LOGIN PASSWORD 'nile' CREATEDB;"
sudo -u postgres psql -c "CREATE DATABASE nilebites OWNER nile;"

# 2. Бэкенд + фронт
cd production
cp .env.example .env.local
#    вписать: DATABASE_URL="postgres://nile:nile@127.0.0.1:5432/nilebites"
#            AUTH_SECRET="<openssl rand -hex 32>"  CRON_SECRET="<openssl rand -hex 32>"
bash scripts/w1.sh          # install → migrate → seed → lint → build → smoke
```
**Ожидаемый вывод w1.sh:** `home 200 ok`, `admin login 200 ok`, robots.txt с `Sitemap:`.
```bash
# 3. Концепт-сайт с live-мостом в API
cd .. && make serve         # :8000; API на :3000; мост включится сам
```
**Проверка моста:** на :8000 собрать стакан → ADD TO ORDER → PAY → плашка **«LIVE API: order saved to PostgreSQL»**; на :3000/admin/login (admin@nilebites.com / Nile#2026) → Orders — заказ виден.
**Стоп:** `kill` next-server (`for d in /proc/[0-9]*; do … grep next-serve[r] …`), `sudo service postgresql stop`.

---

## Трек 2. DOCKER-DEV (команда) — 15 минут
```bash
cd production
docker compose up -d        # pg16 :5432 (nile/nile/nilebites) + adminer :8081
cp .env.example .env.local  # DATABASE_URL как в Треке 1
bash scripts/w1.sh
```
- Adminer: http://localhost:8081 (server: `db`, user `nile`) — смотри таблицы вживую.
- Данные переживают перезапуск (volume `pgdata`). Сброс: `docker compose down -v`.
- CI-локально как в GitHub: `docker run -e POSTGRES_USER=ci -e POSTGRES_PASSWORD=ci -e POSTGRES_DB=ci -p 5432:5432 postgres:16` + `npx prisma migrate deploy`.

---

## Трек 3. PRODUCTION — 1 день (по W1-KICKOFF Пн–Вт)
### 3.1 Репозиторий и CI
```bash
git init && git add -A && git commit -m "Nile Bites: concept + production skeleton"
git remote add origin <repo> && git push -u origin main
# GitHub → Settings → Secrets: VERCEL_TOKEN, VERCEL_ORG, VERCEL_PROJECT (+ DATABASE_URL для e2e-сервиса)
```
CI прогонит: lint → build (PG-сервис) → playwright e2e → deploy (ci.yml уже в репо).

### 3.2 База (Neon)
1. neon.tech → project `nilebites-prod` (region eu-central, PG16).
2. Databases: `nilebites`. Roles: `app` (pooled, **PgBouncer URI: .../nilebites?pgbouncer=true&connection_limit=1**).
3. Vercel → проект → Settings → Env: `DATABASE_URL` = pooled URI; `AUTH_SECRET`, `CRON_SECRET`, `NEXT_PUBLIC_SITE_URL=https://nilebites.com`, блок Paymob/Sanity/WA из SECRETS.md (Production + Preview).
4. Миграции и seed **один раз вручную** с машины с доступом к БД (или через CI-job с whitelisted IP):
```bash
DATABASE_URL="<pooled>" npx prisma migrate deploy
DATABASE_URL="<pooled>" SEED_ADMIN_PASSWORD="<сильный>" npx prisma db seed
# сразу смени пароль админа через /admin или SQL: update "Staff" set "passwordHash"=…
```
5. Neon → Branches: создай branch `preview` для preview-деплоев (Vercel Preview Env подхватит DATABASE_URL branch автоматически).

### 3.3 Sanity CMS
```bash
npx sanity init          # проект nilebites, dataset production (или создай на sanity.io)
npx sanity deploy        # студия на *.sanity.studio → привяжи домен studio.nilebites.com
# Vercel env: SANITY_PROJECT_ID, SANITY_DATASET, SANITY_API_TOKEN (server-only!), NEXT_PUBLIC_SANITY_*
```
Контент-типы уже в `cms/schema.ts`; первый контент: 5 продуктов, 6 точек, 4 соуса (копии из seed — источник истины первые 2 недели PG).

### 3.4 Домен и почта
| Запись | Имя | Значение |
|---|---|---|
| ALIAS/A | @ | cname.vercel-dns.com / 76.76.21.21 |
| CNAME | www | cname.vercel-dns.com |
| CNAME | studio | sanity.hosting (из Sanity dashboard) |
| TXT | @ | v=spf1 include:spf.resend.com ~all |
| TXT | resend._domainkey | DKIM из Resend/Postmark |
| TXT | _dmarc | v=DMARC1; p=quarantine; rua=mailto:it@nilebites.com |
| CAA | @ | 0 issue "letsencrypt.org" |

Vercel → Domains → add nilebites.com → SSL auto (ждём `Issued`), HSTS включить после недели аптайма.

### 3.5 Cron и вебхуки
- `vercel.json` уже содержит crons: sla/points каждые 5 мин, winback 10:00, waste 02:30 (Hobby-план: максимум 2 crons → на Hobby оставь sla+points, остальное внешним cron-сервисом).
- Paymob dashboard → Webhooks → `https://nilebites.com/api/webhooks/paymob`, secret → `PAYMOB_WEBHOOK_SECRET`. Тест: sandbox-платёж → в PG у заказа `payRef` + статус NEW.

### 3.6 Пост-деплой smoke (10 минут, руками или скриптом)
```bash
curl -s https://nilebites.com/api/health                 # {"ok":true,"dbMs":<200}
curl -s https://nilebites.com/robots.txt | head -2       # Sitemap: …
curl -s -o /dev/null -w "%{http_code}" https://nilebites.com/ar        # 200
curl -s -o /dev/null -w "%{http_code}" https://nilebites.com/locations/hurghada  # 200
curl -s -o /dev/null -w "%{http_code}" https://nilebites.com/admin/login         # 200
curl -s -X POST https://nilebites.com/api/order -H 'Content-Type: application/json' \
  -d '{"cup":{"bite":"kofta","sauce":"garlic","size":"12","tops":[],"qty":1},"mode":"pickup","name":"Smoke","phone":"+201000000009","storeSlug":"hurghada"}'
# → {"publicId":"NB-…"}; затем /admin/orders?q=NB-… виден; и отмени его через PATCH status CANCELLED (reason: smoke)
```
SSE-проверка: открыть /kds на двух экранах → создать заказ → тикет появился <2 c.

### 3.7 Концепт-сайт (витрина/демо для инвесторов)
`index.html` самодостаточен: кладём на любой статик-хостинг (Vercel static / R2+CDN / GitHub Pages).
Чтобы демо писало в прод-API: в консоли браузера `localStorage.setItem('nb-api','https://nilebites.com')`
(или отдай демо-домен demo.nilebites.com с этим пресетом в index.html-обёртке). API-роуты order/scan/lead/deck уже CORS-открыты.

### 3.8 Rollback-план
- Код: Vercel Deployments → Promotion rollback (1 клик), миграции обратно только новой миграцией (не drop!).
- Данные: Neon PITR (7 дней) → restore branch → проверить → promote.
- Экстренно: feature-флаги в CMS (store.live=false ставит точку на паузу без деплоя).

---

## Траблшутинг (то, на чём реально спотыкались)
| Симптом | Причина / лечение |
|---|---|
| `next build` убит (SIGKILL/ENOMEM) | мало RAM: typecheck отдельно `npx tsc --noEmit`, в build `typescript.ignoreBuildErrors` (в CI — полный lint) |
| `/admin/login` 404 | next-intl middleware требует сегмент `[locale]` — страницы лежат в `app/[locale]/`, matcher не трогает api/ассеты |
| SSE «залипает» за прокси | заголовки `X-Accel-Buffering: no` + `no-transform` (уже в vercel.json и route) |
| Prisma `P1012 enum` | enum'ы только столбиком (см. schema.prisma) |
| Концепт не видит API | API не поднят или другой порт: `localStorage nb-api`; без API сайт молча уходит в offline-демо |
| Fonts 404 в проде | шрифты лежат в `public/fonts/` (Anton/Archivo/Cairo), next/font/local — не удалять папку |
| CORS preflight красный | роуты order/scan/lead/deck имеют OPTIONS+jres из `lib/cors.ts` — не сносить при рефакторинге |

---

## Чек-лист приёмки деплоя (подпись tech lead)
- [ ] CI green на main; deploy automatic.
- [ ] /api/health dbMs < 200 из региона Европы.
- [ ] Заказ site → KDS SSE < 2 s; отмена → Risk.
- [ ] /ar RTL не ломает сетку (сверить с shots/regress-desktop-ar.jpg).
- [ ] Consent-баннер: marketing/analytics не грузятся до согласия (DevTools → Network).
- [ ] Sentry ловит тестовую ошибку; алерт в Telegram пришёл.
- [ ] Backup-restore drill: Neon branch restore выполнен и проверен.
- [ ] Пароли seed-аккаунтов сменены; SECRETS.md пройден целиком.

*Деплой — это W1 дни 1–2. Дальше по `docs/W1-KICKOFF.md` до gate в W2.*
