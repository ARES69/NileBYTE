# VOICE ORDER → WHATSAPP CLOUD · PRODUCTION SPEC
### v1.0 · из NILE LAB H2 в прод (W3) · демо-грамматика: `parseVoice()` в концепте src/app.js

## 1. Цель и каналы
Голосовой заказ без приложения: голосовое сообщение WhatsApp (основной канал EG) → заказ в KDS.
Позже: телефонный IVR тем же парсером. Языки: **ar-EG (первый)**, en-US, ru-RU.
Целевые метрики: containment ≥70% (без человека), completion ≥45% от начатых, time-to-order ≤90 s.

## 2. Архитектура
```
[Клиент WA] --voice note--> [WhatsApp Cloud API] --webhook (X-Hub-Signature-256)--> [wa/webhook route]
   --> media download (OGG/opus, temp 7d TTL) --> [ASR: Azure Speech ar-EG / fallback Google STT]
   --> [Intent parser v1 = грамматика концепта: filling x size x sauce x tops]
   --> [WaSession state machine: GREET → CAPTURE → CONFIRM → PAY → DONE]
   --> order create (/api/order channel=WHATSAPP) --> Outbox order_new --> KDS SSE
   <-- WA template: summary + Paymob payment link / cash-on-pickup code
```
Компоненты (Next API routes): `api/wa/webhook` (verify+route), `api/wa/asr` (serverless→ASR), `lib/wa-intent.ts` (порт parseVoice + слот-филлинг), `lib/wa-session.ts` (Redis или PG таблица WaSession, TTL 30 min).

## 3. Диалог и фолбэки
1. GREET (template approved Meta): «Nile Bot 🐊 (бот, не человек). Скажи голосом или выбери: 1–5 начинки…».
2. CAPTURE: голос → ASR → parser; недостающие слоты добираем кнопками WA (list-message): size, sauce, tops.
3. CONFIRM: summary-сообщение + «Ответь OK / تأكيد / да» или кнопка Pay; 2 ретрая ASR → numbered menu → 3-й fail → handoff человеку (уведомление менеджеру в Admin).
4. PAY: Paymob link (card/wallet) или cash-code на кассе; после PAID webhook → order NEW в KDS.
5. POST: после DONE — QR-ссылка «оцени стакан» (scan-CRM замыкается).

## 4. Грамматика v1 (из демо)
- entities: filling(kofta|shawarma|shatta→kofta+shatta|cheese|shrimp), size(8|12|18), sauce(garlic|tahini|shatta|signature), tops(onion|cheese|herbs|chilli|lemon).
- синонимы AR/EG: كفتة/لحمة, فراخ/شاورما, جبنة, جمبري; размеры: وسط=12, كبير=18, صغير=8; «حراق/بركان»=shatta/fire.
- тест-сет: 12 демо-фраз из концепта (VOICE_SAMPLES + QA-прогоны) → unit-tests парсера в CI.

## 5. Данные и комплаенс
- WaSession: waId(hash), lang, state json, order draft, created/expires; аудио −7 d авто-удаление; транскрипты −30 d анонизированные для ASR-тюнинга.
- Opt-in: пишем только в 24-часовое окно пользовательского сообщения или по approved template; consent-флаг из ConsentLog синхронизируется.
- Meta-шаблоны: GREET/CONFIRM/PAY/REMIND — пре-аппрув; дисклеймер «Nile Bot» в каждом первом сообщении (этика LAB #4).

## 6. Экономика канала
- WA conversation pricing (business-initiated vs user-initiated): держим user-initiated majority (QR на стакане → «напиши нам голосом»).
- ASR cost ≈ $0.6–1.0 / 1000 мин (ar-EG); средний заказ 0.4 мин → <0.05 EGP/заказ.
- Сравнение: CAC whatsapp ≈ 6–9 EGP vs paid social 41 EGP (данные концепт-админки).

## 7. Rollout (стык с W3 ранбука)
1. Meta App + Cloud API номер, webhook verify token, sandbox test-number.
2. Paymob payment-link flow поверх /api/order (channel WHATSAPP).
3. ASR-ключи Azure (region me-central), фолбэк Google; WER-чек на 50 размеченных голосовых ar-EG.
4. Admin: вкладка WhatsApp в Orders (channel-фильтр уже есть) + containment-дашборд в Marketing.
5. e2e: playwright + WA sandbox: голосовой файл → заказ в KDS < 5 s.
6. Go-live: QR на стакане batch B с wa.me-динком «voice order».

## 8. Риски
- ASR ar-EG на уличном шумe → numbered-menu фолбэк обязан быть в каждом шаге.
- Meta policy: promo-шаблоны только после opt-in; хранение аудио — EG DPL 151/2020 (шифрование at-rest).
- Пиковые часы: serverless concurrency ASR — квоты и очередь с честным «перезвоним через 2 мин».

*Демо-источник: концепт #lab VOICE ORDER (Web Speech API + parseVoice). Эта спека = путь демо → прод без переизобретения грамматики.*
