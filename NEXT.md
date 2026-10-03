# NILE BITES — ЧТО ЕЩЁ НУЖНО САЙТУ
### Research-based бэклог · v1.0 · 28.09.2026 · источники: веб-исследование (ссылки в конце)

Легенда: ✅ уже есть в концепте · ⬜ нет · P0 = влияет на выручку/доверие сейчас, P1 = рост, P2 = масштаб.

---

## P0 — продажи и доверие (делать сразу)

| # | Блок | Зачем (инсайт) | Что сделать у нас | Статус |
|---|---|---|---|---|
| 1 | **Delivery-партнёры по городам** | Рынок доставки Египта ≈ $543M (2025), дуополия **Talabat и elmenus** (+ новый Rabbit). Сайт обязан уводить в привычный клиенту app, а не только в свой checkout | В карточке точки и в DELIVERY-блоке: кнопки «Order on Talabat / elmenus» deep-link по городу; свой checkout — как «выгоднее» (без комиссии) | ⬜ |
| 2 | **WhatsApp ORDER** | В MENA рестораны теряют продажи без WhatsApp-коммерции; автоматизация даёт до +40% заказов в пик и +25% к среднему чеку | Кнопка `WhatsApp` в nav/order bar/карточке точки: wa.me с префаком «Hi! I want a Nile Cup: 12 bites, garlic…» из конструктора | ⬜ |
| 3 | **Аллергены + dietary-фильтры + Kcal** | Аллерген-инфо на цифровых меню — стандарт и растущее регуляторное требование (EU 1169/2011 покрывает non-prepacked; в США bills 2025-26); фильтры (veg/spicy/nuts/gluten) — must-have цифрового меню | В MEET THE BITES и конструкторе: иконки аллергенов (глютен, молоко, кунжут/тахини, морепродукты), бейджи VEG/SPICY, строка Kcal & macros на карточке; фильтр-чипсы над сеткой | ⬜ |
| 4 | **Structured data + Local SEO** | Restaurant/Menu/LocalBusiness schema + оптимизированный Google Business Profile + локализованный контент = основа локальной выдачи и AI-Overviews | JSON-LD: `Restaurant` (адрес, часы, меню, acceptsReservations=false), `Menu`, `FAQPage` (franchise), hreflang en/ar; per-location страницы с NAP | ⬜ (частично: NAP есть в карточке) |
| 5 | **Per-location страницы** | «Locations and hours» — базовый must-have; QR-меню и часы/праздничное расписание по точкам | Роут `/locations/hurghada`: часы (вкл. праздники), телефон, направления, фото точки, своё QR-меню, delivery-зоны | ✅ концепт `#/loc/hurghada` |
| 5b | **Checkout order-flow** | location → food → sauce → pay без трения | Модалка 1-2-3: pickup/delivery, промо NILE10, +points, заказы в localStorage | ✅ концепт + ✅ мост с сайтом (data-layer localStorage) |
| 6 | **Halal / сертификаты** (в деке заявлено; страница сертификатов — перед продом) | Региональная специфика EG/GCC: турист и локал ищут подтверждение halal и food-safety | Бейдж «100% Halal» + страница сертификатов (NFSA/halal) в футере-трасте | ⬜ |

## P1 — рост и удержание

| # | Блок | Зачем | Что сделать | Статус |
|---|---|---|---|---|
| 7 | ✅ **Nile Club onboarding**: телефон → OTP-мок → карта с QR + wallet-pass; очки из checkout; данные текут в админку | | Эффективная лояльность = mobile-first, регистрация за секунды на чекауте, интеграция с POS, behavior-based офферы | Flow: телефон → OTP → карта в Wallet/PWA; авто-ачивки («3 пятницы подряд → free cup»); push/email-триггеры | ✅ блок / ⬜ механика |
| 8 | **Франшизный funnel по правилам игры** | Скорость ответа на лид решает конверсию; Discovery Day — поздняя стадия; FDD выдаётся за 14+ дней до подписания (FTC-логика, перенимается рынком) | На /franchise: FAQ (8-10 вопросов), gate-дек «Franchise Deck PDF» (email), календарь discovery-звонка, SLA «ответим за 24 ч» в форме, квалификация лида (бюджет/опыт) | ✅ форма / ⬜ funnel |
| 9 | ✅ **RU-слой реализован** (74 строки data-ru, переключатель EN\|AR\|RU; DE/ZH — позже) | Хургада/Шарм = русскоязычный турпоток; пользователь брифа уже планировал RU вторым слоем | i18n-словарь готов архитектурно (data-en/ar) → добавить data-ru; переключатель EN|AR|RU только на /locations и tourist-блоке | ⬜ |
| 10 | ✅ **WCAG-фиксы P1** (focus-visible, контрасты); полный аудит — перед продом | Иски по web-accessibility растут (3 117 федеральных дел ADA в 2025); меню/заказ/локации — зоны риска | Аудит: контраст muted-текста, focus-visible на чипсах/пинах, aria-live для цены, keyboard-проход конструктора, reduced-motion (уже есть) | ✅ частично |
| 11 | ✅ **Consent-баннер + preferences** реализован; privacy-центр расширить перед продом | GA4/Meta pixel + собственная CRM-аналитика сканов = персональные данные (EG Data Protection Law 151/2020 + GDPR для туристов) | Consent-баннер с гранулярностью (necessary/marketing/analytics), политика скан-данных QR в Privacy | ⬜ |
| 12 | **Catering & group orders** | Catering-опции — стандартный must-have ресторанных сайтов | /catering: Cups Party Box (24/48/96 bites), соус-бар, доставка на event; B2B-форма | ⬜ |

## Бизнес-материалы — РЕАЛИЗОВАНО
- ✅ **Franchise Deck**: 10 слайдов PDF (make_deck.py), вшит в гейт «GET THE DECK» на сайте.
- ✅ **BRANDBOOK.md**: знаки, палитра с долями, типографика EN/AR/RU, ToV, фото-стиль, упаковка, motion, DO/DON'T.
- ✅ **CONTENT-PLAN.md**: 30 дней контента + KOL-план + метрики.

## Продакшен-миграция — СКЕЛЕТ ГОТОВ
- ✅ `production/`: Next.js 15 + Tailwind-токены + Framer Motion + next-intl; Prisma-схема PG; Sanity-схема; API order/scan/lead/deck; CI (lint→build→e2e→deploy); runbook с rollout-чеклистом 6 недель.

## P2 — масштаб бренда

| # | Блок | Зачем | Что сделать | Статус |
|---|---|---|---|---|
| 13 | Careers-хаб | «JOIN THE NILE» из брифа | Секция #careers: 6 ролей + модалка заявки (nb-apps, SLA 48 h) | ✅ концепт |
| 14 | UGC-wall с правами | Соц-пруф конвертит; нужен consent-механизм репостов | Стена #MyNileBITE: rights-чекбокс → модерация → репост | ✅ концепт |
| 15 | Gift cards & merch | Дополнительный revenue-stream QSR | e-Gift модалка 150/300/500 EGP + код + QR (nb-gifts); merch-drop — след. шаг | ✅ концепт |
| 16 | Investor room | Бриф: метрики → investor-страница | Гейт NILE-2029 (демо) + KPI-ряд + run-rate chart; прод = data-room NDA | ✅ концепт |
| 17 | PWA «Nile App» | Лояльность mobile-first; установка с QR стакана | manifest + sw.js offline-shell + иконки; push-купоны — на проде | ✅ концепт |
| 19 | **NILE ADMIN** — ops-дашборд из брифа §38: Sales/Orders/Products/Inventory/Stores/Customers/Loyalty/Marketing/Analytics/Franchise + TODAY-виджет | Реализован концепт: `admin.html` (PIN 2026, live-заказы, CSV-экспорт, лиды из формы сайта) | ✅ концепт + ✅ мост с сайтом (data-layer localStorage) |
| 18 | Blog / «Nile Journal» | Локальный контент = SEO + AI-Overviews | Истории блюд, гиды по Хургаде, рецепты соусов (EN/AR) | ⬜ |

---

## Топ-5 quick wins — РЕАЛИЗОВАНО в прототипе (28.09.2026)
1. ✅ WhatsApp: FAB + кнопка в карточке точки; префак сообщения собирается из конструктора (EN/AR), wa.me/2065…
2. ✅ Talabat/elmenus: блок «ALSO ON» в DELIVERY + строка «Also on:» в карточке live-точки (deep-links по городам — на запуск).
3. ✅ Аллергены (GL/DA/EG/SH с тултипами EN/AR) + бейджи VEG/SPICY + Kcal/12 bites в карточках; фильтры ALL/VEG/SPICY/SEAFOOD над сеткой.
4. ✅ JSON-LD @graph: Restaurant (часы, гео, меню) + Menu (5 позиций, цены EGP, диеты) + FAQPage (8 вопросов) + hreflang en/ar/x-default.
5. ✅ Franchise FAQ (8 вопросов, аккордеон, EN/AR) + gate «GET THE DECK»: email → скачиваемый PDF-стаб (data-URI, сгенерирован build-скриптом).

---

## Источники
1. Restaurant website must-haves (ordering, menu descriptions, locations & hours, catering): https://www.menutiger.com/blog/restaurant-website
2. QR-меню, аллерген-теги, mobile-first меню 2026: https://stylishpricelist.com/wordpress-restaurant-menu-features-2026/
3. Аллергены на цифровых меню — best practices: https://www.restomas.com/blog/best-practices-for-showing-allergen-details-on-digital-restaurant-menus
4. Dietary-фильтры в онлайн-меню: https://www.wpslash.com/how-to-add-allergen-information-and-dietary-filters-to-your-woocommerce-restaurant-menu-2025/
5. EU: маркировка аллергенов включая non-prepacked: https://food.ec.europa.eu/food-safety/campaign-2026/allergies_en
6. Онлайн-заказ: dedicated ordering menu, mobile-first: https://rezku.com/blog/restaurant-online-ordering-best-practices/
7. Египет: рынок доставки $542.9M (2025), Talabat/elmenus: https://vocal.media/futurism/egypt-online-food-delivery-market-trends-growth-drivers-and-future-prospects
8. Дуополия elmenus/Talabat: https://inpractise.com/articles/elmenus-and-egyptian-food-delivery
9. Rabbit заходит в food delivery EG: https://www.facebook.com/Think.Marketing.Magazine/posts/1198432012309276/
10. Египетские рестораны теряют продажи без WhatsApp: https://www.linkedin.com/posts/redood_whatsappcommerce-restaurants-foodtech-activity-7485664085683032065-VQoH
11. WhatsApp-автоматизация: +40% заказов в пик, +25% AOV: https://tbit.app/content/whatsapp-automation-trends-restaurants-2025-latin-america
12. Conversational commerce MENA: https://c3mailime.com/use-cases/conversational-commerce
13. Лояльность: enrollment at checkout, behavior-based, POS: https://www.unplugdining.com/blog/12-best-restaurant-loyalty-program-ideas-that-actually-drive-repeat-orders
14. Лояльность mobile-first: https://www.voucherify.io/blog/restaurant-loyalty-programs-best-practices-and-examples
15. Персонализация данными (67% QSR): https://restaurant.org/education-and-resources/resource-library/innovations-in-restaurant-loyalty-programs/
16. QSR loyalty-платформы: https://www.snipp.com/blog/qsr-restaurant-customer-loyalty-programs-promotions
17. Франшизный lead-gen и скорость ответа: https://ignitevisibility.com/franchise-lead-generation-strategies/
18. Discovery Day / конверсия лида: https://www.franfunnel.com/answers/franchise-development-lead-generation-conversion-framework
19. FDD за 14 дней до подписания: https://leadfso.com/franchise-sales/franchise-discovery-day-agenda/
20. Restaurant schema markup: https://inoriseo.com/seo/restaurant-schema/
21. LocalBusiness structured data (Google): https://developers.google.com/search/docs/appearance/structured-data/local-business
22. Restaurant SEO-чеклист 2026 (GBP, schema, AI Overviews): https://devournow.com/business/rank/problems/restaurant-website-seo-checklist
23. SEO для ресторанов: GBP + Restaurant/Menu schema + отзывы: https://ighenatt.es/en/resources/seo-sectorial/seo-para-restaurantes/
24. WCAG 2.1 AA для ресторанных сайтов: https://accessible.org/restaurant-website-ada-compliant/
25. Рост исков по web accessibility (3 117 дел ADA-2025): https://www.levelaccess.com/blog/2024-u-s-web-accessibility-litigation-key-trends-and-strategies-for-mitigating-risk/
