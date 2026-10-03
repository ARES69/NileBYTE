# NILE BITES — КАК РЕДАКТИРОВАТЬ САЙТ
Шпаргалка · v1.0 · 28.09.2026

## Главное правило
```
src/index.html  ┐
src/styles.css  ├──►  make site (python3 build.py)  ──►  index.html  (готовый сайт)
src/app.js      ┘
```
**Самый удобный режим:** `make serve` → открыть http://localhost:8000 — сервер сам пересобирает сайт при сохранении файлов в `src/`. Просто правишь → обновляешь вкладку.
Все артефакты проекта собраны на `HUB.html`.
- **`index.html` в корне — НЕ редактируем**: это сборка (4.6 MB, фото/шрифты/PDF вшиты base64).
- Правим только файлы в **`src/`**, затем пересобираем:
  ```bash
  cd nilebites
  python3 build.py          # соберёт index.html
  python3 qa_shots.py       # (опционально) свежие скриншоты, нужен playwright
  ```
- Открыть результат: двойной клик по `index.html` или превью в чате. Работает офлайн.

## Где что лежит
| Что менять | Файл | Где искать |
|---|---|---|
| Тексты EN/AR | `src/index.html` | атрибуты `data-en="..."` / `data-ar="..."` + текст между тегами |
| Тексты из JS (статусы OPEN NOW, состав стакана, тосты) | `src/app.js` | словарь `L = {...}` в начале файла |
| Цены, начинки, соусы, размеры, топпинги | `src/app.js` | объекты `PRICING`, `SAUCES`, `SIZES`, `TOPS` |
| Цены-плашки на карточках меню | `src/index.html` | секция `#bites`: `data-price=` и `<span class="price">…` |
| Точки на карте (города, часы, телефоны) | `src/app.js` | массив `LOCATIONS` (x/y — координаты на карте 620×620) |
| Номер WhatsApp | `src/app.js` | константа `WA_NUM` |
| Цвета, шрифты, радиусы, скорости | `src/styles.css` | блок `:root { --black: … --gold: … }` |
| Раскладка секций, кнопки, карточки | `src/index.html` + `src/styles.css` | комментарии-разделители `/* ==== SECTION ==== */` |
| Фото | папка `img/` + токены `@@IMG:имя@@` в `src/` | размеры/качество сборки — `IMG_SPEC` в `build.py` |
| PDF франшизного дека | `src/deck-pdf.b64` | заменить: `base64 -w0 мой_дек.pdf > src/deck-pdf.b64` |
| SEO (schema, hreflang) | `src/index.html` | `<script type="application/ld+json">` в `<head>` |

## Рецепты

### 1. Поменить текст
Ищем строку в `src/index.html` (Ctrl+F по видимому тексту). Меняем **три места**: текст между тегами, `data-en`, `data-ar`.
```html
<p data-en="Hot dumplings. Bold sauces." data-ar="دمبلنجز سخنة. صوصات قوية.">Hot dumplings. Bold sauces.</p>
```
Если текста нет в HTML (появляется динамически) — он в словаре `L` в `app.js`.

### 2. Поднять цену KOFTA со 145 на 159
- `src/app.js`: в `PRICING.kofta` → `base: 159`.
- `src/index.html`: в карточке KOFTA → `data-price="159"` и `<span class="price">159 <i>EGP</i></span>`.
- `build.py` не трогать. Пересобрать.

### 3. Добавить новую начинку (например, FALAFEL)
1. Положить фото `img/bite-falafel.jpg`.
2. В `build.py` → `IMG_SPEC` добавить `'bite-falafel': (900, 76),`.
3. В `src/index.html` в `#bites__grid` скопировать любой `<article class="bite reveal">`, поменять: `data-bite="falafel"`, `data-tags="veg"`, `data-price`, `@@IMG:bite-falafel@@`, название/описание/цену (EN+AR).
4. В `src/app.js` → `PRICING` добавить ключ `falafel: { base: 115, en: 'Falafel', ar: 'فلافل', color: '#6B8E3A', hi: '#A9C46C' }`.
5. В `app.js` в обработчике `.js-try` добавить `'falafel'` в список допустимых ключей.
6. `python3 build.py`.

### 4. Добавить город на карту
В `src/app.js` → `LOCATIONS.push({ id:'aswan', en:'ASWAN', ar:'أسوان', addrEn:'…', addrAr:'…', x:340, y:540, live:false, status:'soon', hours:'—', phone:'—', tel:'', service:'na', map:'https://maps.google.com/?q=Aswan' })`.
`live:true` включает OPEN NOW по часам и ссылки talabat/elmenus.

### 5. Поменять цвет бренда (gold → другой)
`src/styles.css`: `:root { --gold: #E0A72C; }` → свой hex. Пересобрать. Все кнопки/цены/акценты подхватятся.

### 6. Заменить фото
Положить файл с тем же именем в `img/` (например, `img/hero-cup.jpg`) → `python3 build.py`. Новое фото: имя файла + токен `@@IMG:имя@@` в нужном месте `src/index.html` + строка в `IMG_SPEC`.

### 7. Правки только для мобильной версии
`src/styles.css`: блоки `@media (max-width:1100px)`, `760px`, `420px` в конце файла.

### 7.5 Поделиться стаканом / вернуть свой кубок
Состояние конструктора живёт в URL (`?cup=shawarma-12-garlic-onion`) и в localStorage: ссылка «SHARE CUP» копирует готовую конфигурацию; открытие ссылки или возврат на сайт восстанавливает стакан. Формат: `начинка-размер-соус[-топпинги…]`.

### 8. Арабская версия
Все новые тексты сразу пишем с `data-ar`. Числа можно восточными: `١٤٥`. RTL-зеркаливание большинства блоков автоматическое; исключения ищи по `html[dir="rtl"]` в CSS.

## Проверка после правок
```bash
make site       # соберёт и покажет размер ассетов
make shots      # скриншоты desktop/mobile/RTL в shots/
make regress    # полный регресс: 4 режима, листы, отчёт ALL GREEN / FAIL
make tokens     # экспорт токенов для Figma/девов (tokens/tokens.*)
```
Смотрим `shots/01-hero.png`, `04-builder.png`, `30-rtl-hero.png` — этого достаточно для быстрой регрессии.

## Если не хочется руками
Просто напиши в чат, что поменять («подними цену шаурмы на 150», «замени фото героя», «добавь точку в Каире как live») — я внесу правку в `src/`, пересоберу и покажу скриншот.

*Подсказка: после правок в src/ старый index.html перезаписывается сборкой — не теряешь ничего, исходники всегда в src/.*
