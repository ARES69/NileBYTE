# NILE BITES — FUTURE FEATURES (NILE LAB)
### v1.0 · horizon-map 2026→2030 · что демо-готово сегодня, что требует данных/железа, и где этические стоп-линии

Легенда: ✅ демо в концепте · 🔶 нужен бэкенд/данные · 🔬 R&D / железо · ⛔ этический/юр-стоп без отдельного решения.

---

## H1 · NOW–2027 (демо готовы в NILE LAB)
| Фича | Суть | Статус | Данные/зависимости |
|---|---|---|---|
| **Nile Genius** (AI cup advisor) | Диалоговый подбор стакана: mood/spice/diet → конфигурация в конструкторе | ✅ демо (rule-based; прод = LLM с brand-токенами + RAG по меню) | меню, аллергены, история покупок member |
| **Smart Save** (waste-zero dynamic offers) | Прогноз списаний на вечер → оффер −30% на конкретные стаканы 23:00–01:00 | ✅ демо + 🔶 прод-модель на Outbox/waste-данных | waste-журнал, почасовые продажи |
| **AR Cup Story** | Наведи на стакан: крокодил плывёт по Нилу, история бренда, состав | ✅ демо-оверлей; прод = WebAR (model-viewer/8th Wall) без приложухи | 3D-ассет, маркер на сливе |
| **NFC Tap Cup** | Тапни стакан телефоном: +очки, аутентичность (анти-фейк), reorder в 1 тап | ✅ демо; прод = NFC-тег в сливе (€0.03/шт) | тег-партия, Club API |
| **Churn/LTV scoring** | Персональный риск-скор и LTV → размер winback-оффера | ✅ демо в Admin→AI; прод = grad-буст на scan+order фичах | 90 дней транзакций |
| **Waste forecast + auto-PO** | Прогноз списаний по SKU/день → черновик закупочного заказа | ✅ демо (Approve PO); прод = newsvendor-модель | поставки, waste, погода/события |
| **CV QC cup** | Камера на выдаче: fill%, garnish, steam → флаг отклонения до выдачи | ✅ демо-бейджи в KDS; 🔬 прод = edge-CV (YOLOv8-seg) | камера, edge-бокс |
| **Digital Twin очереди** | Симуляция очереди на 3 ч вперёд → рекомендация по смене (+1 crew 19–21) | ✅ демо-график; прод = discrete-event sim на реальных тикетах | KDS-таймеры |

## H2 · 2027–2028 (демо вкатаны в NILE LAB; прод требует инфраструктуры)
| Фича | Суть | Статус демо | Что нужно в прод |
|---|---|---|
| **Voice order (AR/EN/RU)** | WhatsApp/телефон-бот: «ялла, كوب كفتة حراق» → заказ в KDS | ✅ демо: Web Speech API (ar-EG/en-US/ru-RU) + intent-парсер → конструктор; фолбэк демо-фраз | WA Cloud API + ASR/TTS с египетским диалектом |
| **Nile Pass (subscription)** | 1 стакан в день за фикс в месяц; pause anytime | ✅ демо: join → pass-карта с QR + streak; MRR-метрика в Admin Loyalty | биллинг Paymob recurring |
| **Robot delivery pilot** | Марина/променады Хургады: ровер последней мили | ✅ демо: режим ROBOT PILOT в checkout (25 min, free) + live-трекер ровера в LAB | муниципальный пилот, страховка |
| **Smart Cup IoT** | Термодатчик в стакане: freshness-таймер в приложении, «cup is at perfect temp» | ✅ демо: BLE-гейдж темпа + окно свежести countdown, чтение крышки | PCB-партия, BLE |
| **Generative city creatives** | Авто-креативы под город/событие в бренд-токенах (без нарушения BRANDBOOK) | ✅ демо: Admin Marketing → 3 варианта + brand-guard чек-лист + human approve | LLM-pipeline + бренд-гард ревью |
| **Predictive staffing** | План смен из прогноза спроса + школьные/туристические календари | ✅ демо: Admin AI → таблица crew now/AI + delta, approve roster с audit-log | HR-интеграция, forecast |
| **Waste ledger (measured)** | Публичный дашборд списаний/упаковки по точкам — анти-greenwashing фактами | ✅ демо: публичный WASTE LEDGER в LAB (4 метрики с аудит-пометками) | waste-журнал как источник истины |

## H3 · 2028+ (демо вкатаны; прод = R&D)
| Фича | Суть | Статус демо |
|---|---|---|
| **Autonomous kiosk** | Kiosk без смены: robot-arm finish + CV QC + self-clean cycle | ✅ демо: Admin Stores → kiosk fleet (AUTO/MANUAL toggle, CV%, self-clean, incident paging) |
| **Taste profile ID** | Профиль вкуса member (spice/cream/acidity) → персональный sauce-blend на central kitchen | ✅ демо: LAB-квиз → blend % по 4 соусам + ID NB-TST + SAVE TO CLUB + BREW MY CUP |
| **Cup-as-ticket** | Стакан = билет на событие/фелуку: партнёрские интеграции туризма | ✅ демо: cup-id → перки партнёров (felucca/museum/market) с активацией |
| **Franchise AI copilot** | Копилот партнёра: site selection по трафику/конкурентам, P&L-симулятор точки | ✅ демо: слайдеры traffic/rent/competitors + формат → orders/rev/EBITDA/margin/payback + score 0–97 + verdict; SEND SIM → nb-sim |

---

## Этические стоп-линии (правила NILE LAB)
1. **Dynamic pricing ≠ surge на голод**: скидки только вниз и только на риск-списания; наценка по спросу запрещена правилом бренда.
2. **CV на кухне смотрит на стакан, не на людей**: face-detection выключен на уровне модели; кадры не покидают edge.
3. **NFC/scan — opt-in**: тап работает только после согласия в Club; тег не содержит PII, только cup-id.
4. **Voice/LLM не имитируют человека без дисклеймера**: бот всегда «Nile Bot».
5. **Прогнозы не увольняют**: staffing-рекомендации — вход для менеджера, решение человек (audit-log).
6. **Любая «будущая» метрика на публичном сайте — только с измеренным источником** (zero greenwashing, правило паспорта).

## Как демо вкатано сегодня
- Сайт: секция **NILE LAB** (#lab): Genius-чат, Smart Save claim, AR-оверлей, NFC-tap.
- Админка: раздел **AI**: churn/LTV, waste forecast + auto-PO, CV QC, digital twin.
- Всё пишет в localStorage-мост (`nb-saves`, `nb-taps`, `nb-po`) — видно в Data JSON экспорте.

*FUTURE.md — живой документ: фича переезжает H3→H2→H1 по мере появления данных/железа/юр-решения.*
