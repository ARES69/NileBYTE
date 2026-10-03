# NILE BITES — ДИЗАЙН-КОНЦЕПТ ГЛАВНОЙ СТРАНИЦЫ
### Техническое задание / дизайн-спецификация · v1.0 · 28.09.2026

**Статус:** концепт-прототип (single-file HTML, рабочий интерактив)
**Артефакты:** `index.html` (самодостаточный, офлайн), `src/*` (исходники), `img/*` (ассеты), `qa_shots.py` (скриншоты)
**Логика бренда:** «первая точка сегодня → франшиза завтра». Не ресторан, а международный food-бренд египетской street food-культуры.

---

## 0. Как пользоваться этим документом

1. Открыть `index.html` — это живой прототип: анимации, EN/AR (RTL), конструктор стакана, карта Египта, формы. Все фото и шрифты вшиты base64 → работает без сети (в т.ч. в превью без интернета).
2. Ниже — послойное описание: сетка, цвета, типографика, тексты, состояния, адаптив, анимации, данные, стек.
3. Раздел 12 — что резать/добавлять при переносе в Figma/Next.js. Раздел 13 — роадмап «MVP → масштаб».

---

## 1. Пять функций сайта (критерий приёмки)

| Функция | Что делает | Где реализовано в прототипе |
|---|---|---|
| 🍔 Food | продаёт продукт | MEET THE BITES, BUILD YOUR CUP, SAUCES, ORDER BAR |
| 🇪 Brand | создаёт образ Египта | intro «Нил/крокодил», BORN BY THE NILE, палитра, арабская версия |
| 📍 Locations | приводит в точку | FIND YOUR NILE (карта), карточка точки, часы, MAP/CALL |
| 📱 Social | посетитель → контент | THE NILE ON YOUR FEED (9:16), QR «SCAN THE NILE», NILE CLUB, referral |
| 💰 Business | продаёт франшизу | FRANCHISE: WHAT YOU GET, BUILT TO SCALE, форма партнёра |

---

## 2. Токены дизайн-системы

### 2.1 Цвет
| Токен | HEX | Роль |
|---|---|---|
| `--black` | `#0B0906` | бренд, фон-«сцена», навигация, футер |
| `--ink` | `#141110` | карточки на чёрном |
| `--cream` | `#F5EFE0` | контентные светлые блоки, текст на тёмном |
| `--sand` | `#DCC79B` | Египет: фон конструктора, лента |
| `--sand-2` | `#C9AE7C` | фон соц-блока |
| `--gold` | `#E0A72C` | премиальность: CTA, цены, акценты |
| `--gold-lt` | `#F2CE72` | ховеры, подсветка |
| `--terra` | `#C4562A` | еда: marquee-ленты, акценты заголовков |
| `--terra-lt` | `#E2703A` | «горячие» элементы |
| `--chili` | `#C0392B` | острое (SHATTA, бейдж HOT) |
| `--nile` | `#1E6F5C` | река на карте, статус OPEN |

Правило чередования секций: **BLACK → CREAM/SAND → BLACK → TERRA → GOLD** — ритм «сцена/контент/сцена». Никогда не делаем «просто белую» страницу.

### 2.2 Типографика
| Назначение | Гарнитура | Примечание |
|---|---|---|
| Display EN | **Anton** (+fallback Archivo Black, Impact) | узкий гротеск, капс, line-height .86–.95 |
| Display alt / футер-контур | Archivo Black / обводка `-webkit-text-stroke` | «BITES» в hero — контур золотом |
| Body EN | **Archivo** (var, wdth 100) / Manrope-подобные системные | 16–17px, lh 1.6 |
| Arabic (всё) | **Cairo** (var 200–1000) | при `dir=rtl` body и display переключаются на Cairo 900 |
| Цифры цен | Anton | «145 EGP» |

Кегли (clamp): hero `74–238px`, секционные заголовки `44–124px`, sauces-гигант `56–190px`, eyebrow `12px ls .24em`.
Арабская типографика — не перевод, а вторая идентичность: Cairo 900, свои переносы, свои длины строк (см. §7).

### 2.3 Радиусы/тени/движение
- Радиусы: `22px` карточки, `12px` поля, `999px` чипы/кнопки.
- Тени: food-карточки `0 30–50px 60–100px rgba(0,0,0,.3–.6)`; чипы мягче.
- Easing: `--ease cubic-bezier(.22,.61,.36,1)`, выход `--ease-out cubic-bezier(.16,1,.3,1)`.
- Реверанс: всё уважает `prefers-reduced-motion` (интро отключается полностью).

---

## 3. Интро «НИЛ» (цифровая идентичность бренда)

Последовательность (≈4.3 c, чёрный экран):
1. **0.0 c** золотая точка (пульс, рост r2→r9→r4).
2. **0.35 c** точка «становится линией»: SVG-path Нила рисуется stroke-dashoffset 1400→0 за 1.9 s, градиент gold→terracotta.
3. **1.5 c** из линии проявляется силуэт **крокодила** (контур золотом, глаз-точка).
4. **2.05–2.7 c** посимвольно падает **NILE BITES** (stagger 70 ms).
5. **3.0 c** фраза **TASTE THE NILE.** (ls .42em, gold).
6. **4.3 c** оверлей уходит opacity/visibility; hero получает `.is-live` (строки заголовка выезжают снизу).

Управление: клик / Enter / Esc / кнопка SKIP — мгновенный выход; `sessionStorage nb-intro=1` — повторно не показываем; `prefers-reduced-motion` — не показываем вовсе.

---

## 4. Навигация

```
[mark+wave] NILE BITES      MENU STORY LOCATIONS DELIVERY FRANCHISE      عربي | EN      ( ORDER NOW )
```
- Прозрачная над hero → после 30px скролла: `rgba(11,9,6,.86) + blur(16px)`, высота 84→66px, тонкая линия снизу.
- Язык: переключатель **عربي | EN** в шапке, мобильном меню и футере; активный — золото. Сохраняется в `localStorage nb-lang`.
- Мобайл: `NILE BITES ☰`. Бургер → полноэкранное меню: нумерованные строки 01–06 (Anton 30–46px), stagger-вход, CTA «ORDER NOW», язык, email.
- Якоря плавные, офсет 70px (под шапку).

---

## 5. Главная: посекционная раскладка (desktop)

### 5.1 HERO (100svh)
- Фон: фото «стакан в руке / Каир, Нил, пальмы, вечер» — **сильное размытие фона не нужно: фокус держим композицией** — скримы: горизонтальный (слева чёрный 96%→34%) + вертикальный (снизу чёрный). Зерно (SVG-noise, overlay, .16).
- Медленное дыхание кадра: scale 1.04→1.16 за 22s (alternate) + параллакс от мыши (±18px, только pointer:fine).
- Контент слева снизу: kicker-строка городов с пульс-точкой → **NILE** (cream) / **BITES** (контур gold) → sub «EGYPTIAN STREET FOOD / MADE TO GO.» (sand/terracotta) → лид «Hot dumplings. Bold sauces. One unforgettable bite.» → CTA: `ORDER NOW` (gold) + `EXPLORE MENU` (ghost).
- Внизу — ticker-лента слоганов (marquee 34s) + скролл-индикатор (капля в капсуле).
- Мобайл: фото уходит вниз, скрим вертикальный, заголовок 62–110px, CTA в столбец.

### 5.2 MARQUEE-ПОЛОСА (terracotta)
«DUMPLINGS ● SAUCES ● STREET FOOD ●» — Anton 18–30px, бесшовно, rtl разворачивает направление.

### 5.3 ONE CUP. MANY FLAVOURS. (cream)
- Слева-сверху заголовок (2 строки, 2-я — terracotta).
- Сцена: по центру фото-стакан в арочной маске (`border-radius 200px 200px 28px 28px`), float-анимация 7s; вокруг — пунктирная орбита (spin 46s) и 6 чипов-ингредиентов (🥩🌶🧄🌿🍋) по углам, stagger-появление + лёгкий float.
- Под сценой цитата: «We took the comfort of dumplings and gave them an Egyptian soul.»

### 5.4 MEET THE BITES (black)
Сетка 6 колонок:
- **KOFTA — feature** на всю ширину: фото 58% слева (min-h 300–540px), тело справа (имя 44–110px, состав, цена, TRY IT).
- Остальные 4 карточки по 2 колонки: фото 4:3 (70% высоты карточки), имя Anton 28–44px, состав 13.5px muted, цена gold + кнопка `TRY IT` (line).
- Бейджи: BEST SELLER (gold), HOT (chili), NEW (cream).
- Ховер: карточка −8px, рамка gold, фото scale 1.07.
- **TRY IT = продающий шорткат**: ставит начинку в конструктор (+ shatta→соус shatta), тост, скролл к BUILD YOUR CUP.
- Цены (EGP, 12 bites): KOFTA 145 · SHAWARMA 140 · SHATTA 150 · CHEESE 125 · NILE SHRIMP 175.
- Мобайл: 1 колонка, feature становится вертикальным.

### 5.5 BUILD YOUR CUP (sand) — продажный инструмент
Две колонки: слева **sticky-превью** (black-карточка), справа шаги 01–04.
- Превью: SVG-стакан (прозрачное тело, чёрная крышка, чёрный слив с логотипом), внутри — слой начинки (эллипсы цвета протеина, ряды по размеру 8/12/18), слой соуса (заливка цветом соуса), слой топпингов (эмодзи), пар (3 blurred-капли, loop). Ниже live-список (Bites/Size/Sauce/Toppings) и цена Anton 44px gold.
- Шаги: 01 bites (single), 02 sauce (single; signature +10), 03 size (8 / 12 POPULAR / 18 +45), 04 top it (multi: herbs, chilli +5, crispy onion +10, cheese +15, lemon).
- Формула цены: `base(protein, для 12) + sizeDelta(−40/0/+45) + sauce + Σtoppings`.
- Итог-карточка (black): «YOUR NILE CUP» + строка состава + цена (bump-анимация при смене) + `ADD TO ORDER` (gold, тост-подтверждение).
- Мобайл: превью первым, компактное (стакан 130px + список справа), шаги стеком, кнопка заказа дублируется в order bar.

### 5.6 SAUCES (black)
- Гигантский стафф: SAUCE / CHANGES / **EVERYTHING.** (3-я строка — контур terracotta), 56–190px.
- 4 карточки-бутылки (SVG: крышка цветом соуса, тело-заливка, чёрная этикетка): NILE GARLIC «Creamy. Fresh. Garlicky.» · SHATTA «Hot. Smoky. Egyptian.» · TAHINI «Nutty. Smooth. Classic.» · NILE SIGNATURE «Our secret.» (золотая заливка, «?»).
- Ховер: бутылка −8px и наклон, карточка gold-рамка. Кнопка `DISCOVER THE SAUCES`.

### 5.7 BORN BY THE NILE (full-bleed фото Нила)
- Фон с параллаксом (k=.12) + скрим; заголовок BORN BY / THE NILE. (xl, cream/gold-контур через em).
- Текст идеи + «fast, fun and unforgettable» (gold, bold).
- Статистика-строка: 2026 Born in Hurghada · 5 Fillings · 4 Signature sauces · 1 Cup format.

### 5.8 FIRST BITE IN EGYPT? (cream) — туристический блок
- Слева: заголовок 3 строки (3-я terracotta), лид про заказ на EN/AR и выдачу за 4 минуты, CTA `FIND YOUR NEAREST NILE` (terra) + `ORDER DELIVERY` (ghost dark), три мини-карточки PICK UP / DELIVERY / PAYMENT.
- Справа: фото 4:5 с ховер-zoom — **основатель Alla Miller** со стаканом Nile Bites (AI-редакт исходного портрета: сохранены лицо/платье, добавлен стакан и тёплая египетская улица), золотой бейдж `FOUNDER`, неймплейт-подпись: `ALLA MILLER` + цитата «“Where did you get that?” — the best compliment we get.» (AR-версия синхронно).

### 5.9 FIND YOUR NILE (black) — интерактивная карта
- SVG-карта Египта: контур страны (sand 12% заливка, sand-обводка), Нил — зелёная линия, дорисовывается при загрузке (dash 900→0).
- Пины: **Hurghada (live)** + Cairo, Alexandria, Sharm, Marsa Alam, Luxor (planned). Live-пин: ядро terracotta + пульс-кольцо; подпись города; клавиатура-доступно (tabindex, Enter).
- Клик/тап → карточка точки справа (анимация входа):
  - бренд-строка, город Anton 38–66px, адрес, статус-пилюля: `OPEN NOW` (зелёная, пульс) / `CLOSED NOW` (красная) / `COMING SOON` (gold) — OPEN/CLOSED считается по часам точки (10:00–02:00);
  - мета: PHONE, SERVICE; CTA: `ORDER` (gold) `MAP` (внешняя ссылка на maps) `CALL` (tel:, для planned — приглушён);
  - строка «Next: Cairo · Sharm El Sheikh · Alexandria · Marsa Alam».
- Данные точек — массив `LOCATIONS` в `app.js` (id, en/ar, адрес en/ar, x/y, live, hours, phone, service, map-url). Подключить CMS/POS = заменить массив на fetch.

### 5.10 THE NILE ON YOUR FEED (sand-2)
- Горизонтальный рельс 9:16-карточек (scroll-snap, тонкий скроллбар): 4 фото-кадра (открытие стакана, **реальное фото товара с улицы** с бейджем `REAL`, первая реакция, ночная точка) + 4 градиентных «видео»-плейсхолдера с эмодзи и тайм-кодами (0:09–0:31) + плитка `SEE ALL →` (скролл рельса).
- В продакшене: `<video muted loop playsinline>` постеры + tap-to-play; в концепте — имитация кадра.

### 5.11 PACKAGING (black)
- Слева: DESIGNED / TO BE SEEN. + манифест «Your packaging should make people ask “Where did you get that?”» + чипы CUP/SAUCE/BAG/BOX/NAPKINS/DELIVERY + кнопка `SCAN THE NILE`.
- Справа: **brand-board упаковки** (cup/sauce/bag/box с айдентикой «Eye of Horus») в 3D-«вращении» (perspective rotateY −9°→6°, 16s) + мягкая тень-эллипс.
- **THE NILE SYSTEM**:.flow-строка CUP → SAUCE → BAG → BOX → DELIVERY → STORE → **BRAND** (последний — gold-заливка; стрелки пульсируют; rtl зеркалит).
- **QR-блок**: сгенерированный детерминированный QR-паттерн (25×25, finder-квадраты) на cream-плашке + демо «YOUR BITE»: «You just had CHICKEN SHAWARMA», рейтинг ★★★★★ (ховер-превью, клик = оценка, тост «+N points»), строка GET 10 POINTS. Это макет QR-лендинга (§9).

### 5.12 FRANCHISE (cream) — B2B
- Заголовок BRING / NILE BITES / TO YOUR CITY. + лид «built for scale».
- WHAT YOU GET: 6 карточек 01–06 (BRAND, RECIPES, TRAINING, SUPPLY, OPERATIONS, MARKETING) с короткими описаниями; ховер инвертирует в black.
- BUILT TO SCALE: black-плашка, поток 1 STORE ↓ CENTRAL KITCHEN ↓ 10 STORES ↓ 50 STORES ↓ **GLOBAL** + строка «From a single street-food counter to a global food brand.»
- Бизнес-борд с финмоделью («концепция бизнеса») на публичной странице НЕ размещается: это материал **этапа продажи франшизы** (дек / data-room). Файл лежит в `franchise-kit/brand-board.jpg` и подключается только в продажных материалах.
- Форма BECOME A PARTNER: name, city/country, email, investment range (select 4 опции), why; валидация + success-плашка + тост. (В проде — отправка в CRM/почту.)

### 5.13 NILE CLUB (terracotta) + referral
- Слева: лояльность «1 BITE = 1 POINT. 100 points = FREE CUP.» + 4 шага BUY/SCAN/EARN/EAT FREE.
- Справа black-карточка: «WHO'S YOUR NILE BUDDY?», механика (другу FREE SAUCE, тебе 50 POINTS), поле ссылки `nilebites.com/r/…` + COPY (clipboard + тост), прогресс-бар 62/100 с анимацией заполнения по появлению.

### 5.14 CTA-ПОЛОСА (gold)
Гигант «TASTE THE NILE.» (52–180px, black) + «Hot. Juicy. Unforgettable.» + кнопка `BUILD YOUR CUP` (black, ховер gold).

### 5.15 FOOTER (black)
- Контурный логотип NILE / BITES (SVG text stroke, 2-я строка gold-контур).
- 4 колонки: EXPLORE (Menu/Our Story/Locations/Delivery/Franchise/Nile Club), FOLLOW (IG/TT/FB/YT), CONTACT (hello@, franchise@, tel, адрес), HOURS (вс–чт 10–02, пт–сб 10–03) + язык.
- Низ: © 2026 Nile Bites · Terms · Privacy · Careers + пометка «Design concept — not a live store».

---

## 6. Мобильная версия (приоритет №1: трафик из TikTok/IG)

- Шапка: логотип + бургер; CTA прячется в меню.
- Hero: фото-низ, крупный заголовок, CTA-стек, ticker остаётся.
- **ORDER BAR**: фикс-панель внизу («ORDER NILE» + живая цена конструктора), появляется после 85vh скролла, прячется у футера; safe-area inset учтён.
- Конструктор: превью сверху (стакан 130px + список), чипы крупнее под палец (min-h 44px), итоги-карточка стеком.
- Ленты/рельсы: горизонтальный скролл со snap; меню-карточки 1 колонка.
- Тач-цели ≥44px; шрифты не мельче 11px; цены Anton для читаемости на солнце.

---

## 7. Арабская версия (EN | العربية)

- Переключение: `html[dir]`, `html[lang]`, словарь `data-en`/`data-ar` на всех текстовых узлах + плейсхолдеры `data-*-ph` + динамические строки из словаря `L` в JS (статусы, состав корзины, тосты).
- Типографика: вся иерархия переходит на **Cairo 900** (display) / Cairo 400–700 (body); letter-spacing сбрасывается; marquee и стрелки зеркалятся.
- Копирайт — египетский разговорный регистр (не MSA-канцелярит), короткие рубленые строки, брендовые имена латиницей где уместно:
  - Tagline: «أكل شارع مصري.. ياكل وهو ماشي.»
  - Hero lead: «دمبلنجز سخنة. صوصات قوية. لقمة واحدة ما تتنسيش.»
  - CTA: «اطلب دلوقتي», «جرّبه», «اعمل كوبك», «دوّر على أقرب فرع».
  - Story: «نايل بايتس اتولد من فكرة واحدة بسيطة…»
  - BORN BY THE NILE: «اتولدنا على النيل.»
- Числа: в ключевых местах восточно-арабские (١٤٥، ٤٥، ٥٠) — см. data-ar чипов/цен.
- В проде: арабские тексты вычитывает египетский копирайтер; здесь — профессиональная заготовка регистров.

---

## 8. QR-лендинг «YOUR BITE» (макет в блоке packaging)

Скан со стакана → не главная, а персональная страница:
`YOUR BITE → You just had CHICKEN SHAWARMA → Rate ★ → GET 10 POINTS → share buddy link`.
Данные скана (канал CRM): store_id, sku, pack_batch, time, device, referrer, repeat_flag.
Продуктовые метрики для будущей investor-страницы: repeat rate, avg check, CAC-by-channel, scan→rate conversion.

---

## 9. Состояния и микро-интеракции (чек-лист)

- Нав: прозрачная/компактная; бургер open/close; язык EN/AR (3 места).
- Интро: run/skip/done/seen/reduced.
- Чипы: idle/hover/active(is-on)/pressed; размеры с бейджем POPULAR.
- Цена: bump-анимация; order bar show/hide; тосты (add-to-order, try-it, copy, rate, form).
- Карта: pin idle/hover/active/live-pulse; статусы open/closed/soon; call disabled для planned.
- Звёзды: hover-preview, click-rate, тост очков.
- Формы: focus-ring terracotta, валидация, success-плашка.
- Reveal-on-scroll (IntersectionObserver, .reveal → is-in; прогресс-бар клуба).
- Параллакс: нил-фон; мышь-тилт hero (desktop only).

---

## 10. Производительность и доступность

- Single-file: шрифты 4× (Anton, Archivo Black, Archivo var, Cairo var) + 12 фото вшиты base64; итог ≈3.5 MB (для прода — наружу: woff2-сабсеты, AVIF/WebP, CDN, lazy).
- `loading=lazy/decoding=async` на всех фото ниже фолда; aspect-ratio против CLS.
- Семантика: header/nav/main/section/footer, `aria-label` на картах/звёздах/бургере, `role=status` у тоста, skip-link, фокус-стили, tab-пины.
- `prefers-reduced-motion`: отключает интро, marquee, параллакс, float.
- Контраст: gold на black ≥ 7:1; muted-текст не ниже 4.5:1 на своих фонах.

---

## 11. Слоганы (иерархия)

1. **TASTE THE NILE.** — главный (интро, CTA-полоса, footer-логотип).
2. **Egyptian Street Food. Made to Go.** — дескриптор (hero sub, title, meta).
3. **HOT. JUICY. UNFORGETTABLE.** — продуктовый (ticker, CTA).
4. **ONE BITE. YOU'RE IN.** — дерзкий (ticker, соц-контент).

---

## 12. Перенос в Figma / Next.js

- Сетка: 12 кол., max 1400, gutter 24–32, side-pad clamp(20,4vw,64). Брейкпоинты: 1512 / 1100 / 760 / 420.
- Компоненты: `Button(variant: gold|terra|black|ghost|line|light, size)`, `Chip(single|multi|size|top)`, `BiteCard(feature|default)`, `SauceBottle`, `LocPin/LocCard`, `ClipCard`, `StepCard`, `SummaryCard`, `OrderBar`, `Toast`, `LangSwitch`, `FooterWordmark`.
- Автолейаут-токены: radii 22/12/999; тени §2.3; easings §2.3.
- Next.js: App Router, `/ (home)`, `/menu/*`, `/story`, `/locations`, `/order`, `/club`, `/franchise`, `/careers`, `/contact`, `/bite/[qr]` (QR-лендинг), `/admin` (см. §13.4). Tailwind-токены из §2. Framer Motion: интро-таймлайн, reveal, marquee. CMS (Sanity/Strapi): меню, точки, соц-посты, вакансии. i18n: next-intl, словари из §7.
- QR-лендинг и лояльность — отдельные route + API (PostgreSQL: scans, points, referrals).

---

## 13. Роадмап

| Этап | Состав | KPI |
|---|---|---|
| **MVP (сейчас)** | Home (все блоки), EN/AR, конструктор, карта 1 точки, order bar, QR-макет, франшиза-лендинг с формой | конверсия в ADD TO ORDER, сканы QR |
| **Шаг 2** | Реальный order-flow (location → food → sauce → pay), POS/delivery API, Nile Club backend, careers | avg check, repeat rate |
| **Шаг 3** | CMS, мульти-точки, investor-блок с метриками (оборот, точки, клиенты, repeat, чек, маржа, EBITDA), Nile Admin дашборд | EBITDA, unit-экономика |

### 13.4 Nile Admin (заметка для следующего спринта)
Sales · Orders · Products · Inventory · Stores · Customers · Loyalty · Marketing · Analytics · Franchise + виджет TODAY (orders, revenue EGP, avg check, top product, top sauce, peak hour). Делать после появления реальных данных POS.

---

## 13.5 Quick wins раунда 2 (реализовано)
- WhatsApp-канал: FAB (появляется с order bar, rtl-зеркало) + кнопка в карточке точки; текст сообщения = текущая конфигурация стакана (размер, начинка, соус, топпинги, цена) на активном языке.
- Delivery-партнёры: «ALSO ON talabat / elmenus» в туристическом блоке + «Also on:» у live-точки; городские deep-links помечены как pre-launch.
- Меню-траст: фильтры ALL/VEG/SPICY/SEAFOOD (data-tags на карточках), аллерген-чипсы GL/DA/EG/SH с локализованными тултипами (data-*-title), Kcal на 12 bites, бейджи VEG/SPICY.
- SEO-слой: JSON-LD @graph (Restaurant + Menu + FAQPage), hreflang en/ar/x-default; часы и гео совпадают с данными карточки точки.
- Франшизный funnel: FAQ-аккордеон 8 вопросов (EN/AR, + FAQPage schema) и gate «GET THE DECK» — email-валидация → ссылка на PDF-стаб дека (data:application/pdf).

## 13.6 NILE ADMIN (concept dashboard, `admin.html`)
- Вход: PIN-гейт (demo **2026**, sessionStorage) — имитация staff-auth.
- 10 разделов сайдбара: Sales · Orders · Products · Inventory · Stores · Customers · Loyalty · Marketing · Analytics · Franchise.
- Sales = виджет TODAY из брифа: Orders 428 · Revenue 48,920 EGP · Avg check 114 · Top product Chicken Shawarma · Top sauce Garlic · Peak 19:00–21:00 + area-chart по часам, donut соусов, bar выручки по продуктам, live-лента заказов (stream 5 c, пауза LIVE/PAUSED).
- Orders: таблица со статусами new→preparing→ready→done (кнопки прогресса), поиск, фильтры, **реальный экспорт CSV** (Blob-download).
- Products: инлайн-цены и тумблеры on-sale с тостом «synced to site» (концепт push в CMS).
- Inventory: stock-бары, low-stock алерты, create PO / stock count.
- Loyalty/Marketing: points issued vs redeemed, referral-метрики (CAC referral 6 EGP vs 41 paid), QR-воронка cup→rate→club→refer.
- Analytics: repeat rate, retention-когорты, avg check 30d, channel mix (walk-in/talabat/elmenus/whatsapp/site).
- Franchise: пайплайн лидов **из формы сайта** (stage-select), deck downloads, SLA <24 h.
- Графики — рукописные SVG (без библиотек): area/donut/hbars/funnel/cohort. Тема — та же дизайн-система (black/gold, Anton/Archivo).
- **Risk & Exceptions** (негативный контур, 11-й раздел): KPI-ряд красным — Cancellations 14 (3.2%, target <2%), Refunds 425 EGP, Waste 4.1% (target <3%), Open complaints (из QR-сканов 1–2★), SLA breaches 6 (peak 19–21h, wait >12 min), Payment fails 4; лента Open issues с действиями Resolve/Compensate/Fix order (счётчик в сайдбаре живой); waste-бары по продуктам с порогами (>5% red, >3% amber); таблица Refunds & compensations (refunded/store credit); Churn risk 30+ дней с Winback-флоу. В Orders: статус Cancelled + причина под номером заказа + фильтр; в Products: колонки Waste% и Rating ★ с подсветкой проблемных; в Customers: строки churn risk + Winback −20%; в Marketing: панель Negatives & fatigue (unfollows, ad frequency cap, UGC rejected no rights, spam reports); в Franchise: paused-лиды. Админка показывает обе стороны P&L-реальности.
- Сборка: `src/admin.html|css|js` → `admin.html` тем же `build.py`; ссылка «Admin (concept)» в футере сайта.

## 13.7 P1-пакет (реализовано 29.09)
- **Checkout order-flow** (`#checkout`, кремовая модалка, шаги 1-2-3): Location (live-точка + disabled planned) → Pick up / Delivery (20 EGP, бесплатно от 300) → Review заказа (live-синк с конструктором, qty-степпер до 12) → Pay (Card/Cash/Wallet, имя+телефон с валидацией, промо **NILE10** = −10%) → экран подтверждения: номер заказа, ETA по способу, отметка оплаты, **+N points** (bites × qty). Заказ пишется в `localStorage nb-orders` (мост к админке/CRM).
- **Per-location страница**: hash-роут `#/loc/hurghada` (шарится ссылкой), hero-фото точки, часы по дням, адрес + зоны доставки, CTA ORDER/MAP/WA/CALL, QR «scan in store». У planned-городов — тост «страница откроется к запуску». Кнопка STORE PAGE в карточке точки.
- **Consent-баннер**: появляется после интро, если нет выбора; Accept all / Necessary only / Preferences (тумблеры Marketing/Analytics); сохранение в `localStorage nb-consent`; повторный вход через «Cookie settings» в футере; ссылка Privacy с тостом-политикой.
- **RU-слой**: третий переключатель RU; 74 строки data-ru (нав, hero, CTA, меню-секции, турист-блок, точки, футер, checkout, locpage); фолбэк: нет data-ru → data-en; dir остаётся ltr; в display-стек добавлен 'Arial Black' для кириллицы.
- **WCAG-фиксы**: глобальный `:focus-visible` (gold outline), контраст мелкого текста поднят (footer bottom, map hint, filters legend, loc partners/next с .42–.44 до .58–.62).

## 13.8 Мост сайт ↔ админка + Nile Club onboarding (реализовано)
- Единый data-layer на localStorage (ключи `nb-orders`, `nb-leads`, `nb-deck`, `nb-scans`, `nb-ref`, `nb-club`, `nb-leadstage`): сайт пишет, админка читает при рендере раздела.
- Сайт пишет: checkout-заказ (id, ts, items, total, channel=site, loc, mode, pay), лид франшизы (форма), скачивание дека, QR-оценку (звёзды), копирование referral-ссылки, вступление в клуб.
- Админка показывает: Orders — сайт-заказы первыми строками + чип `site: N`; Franchise — лиды с сайта с ⚡ и персистом стадии по email (`nb-leadstage`), KPI leads/deck растут; Customers/Loyalty — новые члены клуба; Marketing — QR-воронка += сканы/вступления/рефералки.
- **Nile Club onboarding на сайте** (блок JOIN NILE CLUB): телефон → OTP-мок (код в тосте) → карта участника: QR, id NB-CLUB-XXXX, 0 points, кнопка WALLET PASS. Без пароля — по брифу «без трения».
- Фикс раунда: декоративные `::before` (packaging/club/preview) получили `pointer-events:none` — иначе перехватывали клики по QR-звёздам и referral.

## 13.9 Бизнес-материалы (реализовано)
- **Franchise Deck** (`franchise-kit/NileBites-Franchise-Deck.pdf`, 10 слайдов, генератор `make_deck.py`, чистый python): cover, concept, product & cup economics (food 31% / margin 63% / halal), brand & packaging, unit economics (300 orders/day, 1.03M EGP/мес, EBITDA 18–22%, P&L-скелет с барами), investment (3 формата 50–150k USD, royalty 5%, fund 2%, payback 3–8 мес), supply & ops, expansion (NOW→2029+), what you get ×6, process 6–10 недель + NDA-дисклеймер.
- Дек **вшит в гейт** сайта: `GET THE DECK` на /franchise отдаёт именно его (base64 через build-токен `@@DECK_B64@@`), а не стаб.
- **BRANDBOOK.md** (`brand/`): идея, логотип и знаки (wordmark / Nile line / Eye of Horus), clear space, палитра с долями 45/25/15/10/5, типографика EN/AR/RU, tone of voice с примерами трёх языков, фото-стиль, упаковка и THE NILE SYSTEM, motion-правила, digital-правила, DO/DON'T.
- **CONTENT-PLAN.md** (`brand/`): 30 дней TikTok/Reels/Stories по неделям (product → people → tourist → system), таблица день/платформа/формат/хук/CTA, KOL-план (8 микро + 2 турблога + фотограф), метрики и пороги пересъёмки.

## 13.10 Продакшен-скелет (реализовано, `production/`)
- Next.js 15 App Router + Tailwind (токены 1:1 из §2) + Framer Motion (lib/motion.ts: таймлайны интро/hero/reveal из §3) + next-intl (en/ar/ru, RTL, hreflang).
- Prisma/PostgreSQL: Store, Product, Order, Scan, ClubMember, PointLedger, Referral, FranchiseLead, DeckDownload, ConsentLog (+ enum'ы каналов/статусов/стадий).
- Sanity CMS: product, store, sauce, socialClip, faq, pageSeo (локализованные поля en/ar/ru).
- API: /api/order (zod + quote из lib/pricing), /api/scan (repeat по deviceId), /api/lead + /api/deck (SLA <24h, signed URL TODO).
- Рабочие острова: Intro (motion-таймлайн), Hero, OrderBar, Consent; home page.tsx = карта секций §5 с TODO-якорями.
- CI: lint → build c PG-сервисом → playwright e2e → deploy; smoke-тесты order/qr/store.
- Runbook `docs/PRODUCTION.md`: стек (Paymob, WhatsApp Cloud, talabat/elmenus deep-links, GA4+Matomo+scan-CRM), роуты, контракт данных сайт↔админ, комплаенс EG DPL 151/2020, rollout-чеклист 6 недель.

## 13.11 P2-пакет (реализовано в концепте)
- **UGC-стена #MyNileBITE** (после ленты): 3×2 сетка 4:5 (фото-кадры + градиент-плейсхолдеры), у каждой карточки бейдж «rights ✓»; форма сабмита: @handle + обязательный чекбокс прав → карточка со статусом «moderation» + запись `nb-ugc`. Механика месяца: лучший клип ест бесплатно (контент-план, неделя 2).
- **Careers «JOIN THE NILE.»** (cream): 6 карточек-ролей (Kitchen / Operations / Store Manager / Marketing / Delivery / Franchise Dev) с инверсией в black на ховер; APPLY → модалка заявки (name/phone/link/why) → `nb-apps`, тост SLA 48 h.
- **Gift cards**: кнопка в Nile Club → модалка GIFT A CUP: номиналы 150/300/500 EGP (Free Cup / Date Night / Squad Box), получатель + сообщение → карта с кодом `NB-GIFT-XXXX` и QR → `nb-gifts`.
- **Investor room** (black, после careers): гейт «Numbers open when they are real» (demo-код NILE-2029, реальный доступ = NDA data-room) → KPI-ряд (ARR run-rate 12.4M EGP, repeat 38%, avg check 114, GM 63%, EBITDA 22%, stores 1→3) + bar-chart run-rate по месяцам M1–M12.
- **PWA-слой**: `site.webmanifest` + `sw.js` (offline-shell, cache-first) + иконки 192/512 (gold Nile-wave на black); регистрация SW только на http(s); в production — `src/app/manifest.ts`.
- Админка: Marketing получает панель «Community loop» (UGC submitted / Gift cards / Job apps) из data-layer.

## 13.12 Convenience-пакет (DX/UX)
- `HUB.html` — навигатор проекта: live-артефакты (сайт/админка/дек/регесс-листы), доки, команды; статус-бейджи.
- `Makefile`: site / deck / tokens / shots / regress / serve / clean.
- `serve.py` — dev-сервер :8000 с авто-пересборкой по mtime `src/*` (watcher-тред + http.server).
- `tokens.py` → `tokens/tokens.json` (W3C-ish: color с ролями и долями 45/25/15/10/5, font, radius, easing, breakpoints, motion, a11y) + `tokens/tokens.css` (:root `--nb-*`) — handoff в Figma/девов из единого источника.
- Сайт: deep-link конструктора `?cup=bite-size-sauce[-tops]` + persist в localStorage + кнопка SHARE CUP (clipboard); восстановление при загрузке (URL приоритетнее LS).
- Админка: `Data JSON` (дамп всех nb-* ключей одним файлом) и `Reset` (очистка демо-слоя) в топбаре.

## 13.13 Раунд a–e: мета/SEO, AR-ревью, KDS, investor-материалы, питч (реализовано)
- **a) OG/social + SEO**: концепт — og:title/description/image, og:locale + alternate ar_EG/ru_RU, twitter:card summary_large_image в `<head>`; production — `app/opengraph-image.tsx` (ImageResponse 1200×630: чёрная сцена, контурный BITES, терракотовый теглайн), `app/robots.ts` (disallow /admin, /bite/, /api/), `app/sitemap.ts` (статики ×3 локали + live-точки, /ar-версии точек).
- **b) AR self-review**: 6 правок египетского регистра — «بيمشي معاك» (MADE TO GO), «دمبلنجز سخنين. صوصات جرئية», латинские хвосты убраны (allergens→مسببات الحساسية, klip→كليب), unit economics→اقتصاديات الوحدة, унификация delivery-строки и формулировки прав UGC.
- **c) KDS (Kitchen Display)**: 12-й раздел админки — живые тикеты new/prep с посекундными таймерами (green <8 / amber 8–12 / red >12 + breach-рамка), BUMP→cooking / FIRE→counter, KPI: in queue, avg wait (target <6), breaching now, passed today; breach >12 min концептуально уходит в Risk (SLA).
- **d) Investor one-pager**: 1 стр. A4 (make_pitch.py): KPI-стрип (ARR 12.4M, repeat 38%, check 114, GM 63%, EBITDA 22%, payback 3–8), WHY NOW (543M рынок, duopoly, QR-CRM, halal), use of funds барами (40/35/15/10), ASK 250k pre-seed; вшит в investor room сайта после гейта (кнопка ⬇ ONE-PAGER).
- **e) Pitch Deck 2026**: 12 слайдов (problem → insight «cup is the platform, QR is the CRM» → product → GTM content-first → traction model «concept → flagship → data» → unit economics → growth → moat → team (Alla Miller founder-led) → roadmap & ask с траншами по метрикам); лежит в franchise-kit + карточка в HUB.

## 13.14 Бэкенд-контур и onboarding точек (production/, реализован скелет)
- Auth: JWT HS256 (jose) + bcrypt; роли admin / manager / kitchen; `scopeStore()` — тенант-гард (staff не видит чужие точки, admin передаёт storeId явно).
- Мультитенант: storeId на orders/scans/staff/invites/outbox; QR резолвит точку из пары sku-batch-storeSlug.
- Event bus: таблица Outbox (событие пишется в транзакции изменения) → KDS SSE (poll 1.5 s), админ-ленты, jobs; апгрейд PG LISTEN → Redis Streams.
- «Подключение ресторана»: POST /api/stores (store live=false + invite 14 дн) → POST /api/stores/[slug]/onboard (часы, зоны, партнёры, QR-партия A по SKU) → mystery-shopper QA → flip live=true; checkout отдаёт 409 store-not-live до этого.
- Платежи: Paymob webhook с HMAC-SHA256 (timingSafeEqual), идемпотент по payRef; FAILED → CANCELLED + Risk.
- Jobs/cron: sla (NEW/PREP >12 min → breach), points (DONE → начисление), winback (30+ d), waste (daily, порог >3%).
- Всё описано в `production/docs/BACKEND.md` + порядок реализации по неделям W1–W6.

## 13.15 Операционные клиенты прода (скелет)
- /kds: SSE-дисплей кухни (колонки NEW/COOKING/READY, таймеры с breach-pulse, BUMP/FIRE, 30-дневный токен экрана).
- /onboard/[slug]: self-activation точки (invite → часы/зоны/партнёры/меню → QR-партия A → ready-for-QA).
- PATCH /api/orders/[id]/status: машина статусов с роль-гардами и emit в Outbox; SSE-роут принимает ?token= для EventSource.

## 13.16 Nile Admin v2 (production/, W5 реализован скелет)
Страницы поверх Prisma+Outbox вместо localStorage: /admin (Sales KPI дня + SSE LiveFeed), /admin/orders (фильтры/поиск серверные), /admin/risk (cancels/SLA/жалобы/refund-интенты), /admin/stores (пайплайн INVITED→QA→LIVE + CreateStore), /admin/leads (инлайн-стадии + PATCH API), /admin/club (members/points/repeat/QR-воронка). Защита: middleware JWT-cookie, роли admin|manager; кухня остаётся на /kds. Подробности: production/docs/BACKEND.md §12.

## 13.18 NILE LAB — фичи из будущего (реализовано демо)
- Сайт, секция #lab: **Nile Genius** (rule-based AI-advisor: mood/spice/diet → конфигурация стакана → APPLY подставляет в конструктор; прод = LLM+RAG), **Smart Save** (waste-zero офферы −30/−40% на вечерние стаканы, claim → nb-saves), **AR Cup Story** (оверлей: Нил-линия, плывущий крокодил,cup-стори из 3 строк EN/AR/RU; прод = WebAR-маркер), **NFC Tap Cup** (тап → +12 очков, аутентичность, nb-taps).
- Админка, раздел **AI & Forecasts**: churn/LTV-скоринг с recommended actions, waste-forecast по SKU + auto-PO (Approve → nb-po), CV QC стаканов (fill/garnish/steam, pass/flag, «no faces»-правило), digital twin очереди с рекомендацией по смене (+1 crew 19–21, решение за человеком, audit-log).
- Правила лаборатории зафиксированы в FUTURE.md: скидки только вниз, CV не смотрит на людей, NFC opt-in без PII, боты с дисклеймером, прогнозы не увольняют, публичные метрики только с измеренным источником.
- Horizon-map H1/H2/H3 (2026→2030+) с зависимостями (данные/железо/юриспруденция) — в FUTURE.md.

## 13.19 NILE LAB H2 — фичи из будущего (демо-реализация)
- Сайт #lab расширен: **Voice Order** (Web Speech API ar-EG/en-US/ru-RU + intent-парсер kofta/cheese/shrimp × size × sauce × tops → APPLY в конструктор; timeout-фолбэк на демо-фразы), **Nile Pass** (join → pass-карта с QR и streak, nb-pass), **Robot Delivery** (режим ROBOT PILOT в checkout: 25 min/free + анимированный трекер ровера), **Smart Cup IoT** (BLE-гейдж: темп 71°C→остывание, окно свежести countdown, чтение крышки), **Waste Ledger** (публичные измеренные метрики с аудит-пометками, wide-карточка).
- Админка: **Generative city creatives** (Marketing: city×hook → 3 варианта копи + палитра + brand-guard чек-лист + human approve → nb-creatives), **Predictive staffing** (AI: таблица crew now/AI/delta по дням + approve roster с audit-log), **Pass MRR** в Loyalty KPI (1999 × nb-pass).
- Этические правила LAB зафиксированы в FUTURE.md (скидки только вниз, CV без лиц, NFC opt-in, human-in-the-loop для roster, measured-only claims).

## 13.20 NILE LAB H3 (демо-реализация)
- **Taste Profile ID**: квиз heat/cream/fresh → бленд по 4 соусам (нормированные %), имя BLEND FIRE-CREAM-CITRUS + ID NB-TST-xxxx, SAVE TO CLUB (nb-taste) и BREW MY CUP (ставит доминирующий соус в конструктор).
- **Cup-as-Ticket**: cup-id → аутентичность + 3 перка партнёров (felucca −20%, museum tea, market −15%) с активацией (nb-ticket).
- **Franchise AI co-pilot** (секция FRANCHISE): слайдеры traffic 5–60k / rent 20–250k / competitors 0–5 + формат kiosk/street/flagship → консервативная модель (capture 2% site-only, capacity-потолки 250/450/700, food 37%, payroll по формату, capex 65/100/135k USD × 50 EGP) → orders/rev/EBITDA/margin/payback + score 0–97 с цветами и verdict-строкой; SEND SIM → nb-sim + SLA-тост 24 h. Проверено: rent 220k → 45 «kill the unit», rent 60k → 95 «strong site».
- **Autonomous kiosk fleet** (Admin Stores): K1 Marina AUTO / K2 food-court MANUAL; robot-arm temp, CV QC %, self-clean cycle, orders; toggle AUTO/MANUAL с audit-пометкой, Log incident → paging manager (SLA 15 min).

## 14. Файловая карта артефактов

```
nilebites/
├── index.html          ← готовый концепт (self-contained, открыть и смотреть)
├── src/index.html      ← разметка с @@IMG/@@FONT токенами
├── src/styles.css      ← дизайн-система + все секции + адаптив + RTL
├── src/app.js          ← i18n, интро, конструктор, карта, QR, формы, тосты
├── build.py            ← сборка: оптимизация фото + base64-инлайн
├── qa_shots.py         ← playwright-скриншоты (desktop/mobile/rtl)
├── img/                ← фото: 12 сгенерированных + founder-cup (AI-редакт портрета основателя),
│                          product-street (реальное фото товара), packaging-board (борд упаковки)
├── franchise-kit/      ← brand-board.jpg: бизнес-борд с финмоделью — только для дека продажи франшизы
├── fonts/              ← Anton, Archivo Black, Archivo var, Cairo var
└── shots/              ← QA-скриншоты состояний
```

*© 2026 Nile Bites · design concept · not a live store.*
