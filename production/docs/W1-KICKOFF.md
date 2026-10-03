# W1 KICKOFF — понедельный план первой прод-недели
### Gate в W2: сайт отдаёт реальные меню/точки из CMS+PG, админ логинится, CI зелёный, домен живой.

## Пн — инфраструктура
- [ ] Vercel project + Neon PG16; прописать секреты по `.github/SECRETS.md` (Required-блок).
- [ ] Домены: nilebites.com + www (DNS ALIAS/CNAME), SSL auto; SPF/DKIM/DMARC для почты.
- [ ] GitHub: ci.yml уже в репо; добавить secrets VERCEL_*; первый прогон CI зелёный.
- [ ] Sentry проект создан, DSN в env; uptime-монитор на /api/health (добавить роут-заглушку, если нет).
- **Приёмка:** `bash scripts/w1.sh` проходит до шага 4 включительно; CI green.

## Вт — данные и доступы
- [ ] `npx prisma migrate deploy` + `db seed` на проде-стейдже: 5 продуктов, 6 точек (Hurghada live), 3 staff.
- [ ] Логин в /admin/login (admin@nilebites.com), смена пароля, создание manager/kitchen для точки.
- [ ] Sanity: создать проект, `sanity dataset list`, деплой студии (/studio), импортировать cms/schema.ts.
- **Приёмка:** admin видит Sales с нулями и Stores-пайплайн; студия отдаёт product-документ.

## Ср — контент-порт
- [ ] Messages уже портированы автоматом: `python3 scripts/extract-messages.py` (340 ключей EN/AR/RU из концепта) — вычитать ar с копирайтером (RU-фолбэк допустим).
- [ ] Перенести 5 продуктов и 6 точек из seed/Sanity в UI-секции home (page.tsx TODO-якори §5).
- [ ] Медиа: загрузить бренд-фото (img/) в Sanity/CDN, включить AVIF в next.config.
- **Приёмка:** home на /, /ar, /ru рендерит реальные данные; RTL не ломает сетку (регресс-лист концепта как эталон).

## Чт — операционный контур
- [ ] KDS-экран: логин kitchen.hurghada, SSE-стрим идёт (тест-заказ через /api/order).
- [ ] Onboard-флоу: admin создаёт store+invite → /onboard/[slug] активирует → QR-ссылки партии A сгенерированы.
- [ ] Paymob: sandbox-аккаунт, webhook-эндпоинт отвечает 200 на тест-подпись (боевой ключ — W3).
- **Приёмка:** заказ site→KDS→status→Outbox→LiveFeed виден end-to-end на стейдже.

## Пт — аудиты и gate
- [ ] Lighthouse mobile: LCP < 2.5 s, CLS < 0.1 на home; fonts subset (latin/arabic separate).
- [ ] a11y: axe-core на home/order/locations: 0 critical; keyboard-проход checkout.
- [ ] SEO: robots/sitemap отдают 200; schema Restaurant валидна в Rich Results; hreflang en/ar/ru.
- [ ] Юрист-старт: черновик Privacy (EG DPL 151/2020) + consent-копия в CMS.
- **Gate W2:** всё выше зелёное + демо-прогон команде; план W2 (payments prod, WA Cloud, QR-тираж).

## Риски недели
- Sanity-студия задержится → контент живёт в seed/PG, CMS подключить W2 (не блокер home).
- Paymob sandbox очередь → webhook мокать локально (hmac-тест в e2e).
- Копирайт AR не вычитан →Ship с EN+AR черновиком, RU-слой включить после вычитки (фолбэк EN).
