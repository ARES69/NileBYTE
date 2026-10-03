# ДЕПЛОЙ С GITHUB НА МИНИ-СЕРВЕР
### v1.0 · три режима: ручной pull → cron-авто → self-hosted runner · + откат и секьюрити-чек

---

## 0. Сначала безопасность (2 минуты, обязательно!)
Ты запушил репо — проверь, не уехали ли секреты и тяжёлое:
```bash
git log --all --oneline -- production/.env.local server/*.pem id_*   # должно быть пусто!
git ls-files | grep -E "\.env\.local|node_modules|/shots/" | head     # если нашлось — см. ниже
```
- Если `.env.local` попал в историю: **ротация** AUTH_SECRET/CRON_SECRET/PAYMOB-ключей на сервере (`rm .env.local && sudo bash server/install.sh` перегенерит) + `git filter-repo` при желании.
- Если `shots/` (51 MB) уехал: `git rm -r --cached shots && git commit -m 'chore: untrack shots' && git push`.
- Если уехали `node_modules/` или `.next/` (репо раздувается, CI медленнее): `git rm -r --cached production/node_modules production/.next production/scripts/dbtools/node_modules -q && git commit -m 'chore: untrack deps' && git push`.
- Корневой `.gitignore` уже добавлен в репо-набор: deps/builds/env/keys/shots/dumps игнорируются; **сгенерированные артефакты (index.html, admin.html, tokens/, franchise-kit/*.pdf) трекаются сознательно** — это деливераблы.

## 1. Доступ сервера к репо (read-only deploy key)
```bash
# на сервере:
sudo -u nile ssh-keygen -t ed25519 -C "nile-mini-deploy" -f /home/nile/.ssh/id_ed25519 -N ""
sudo -u nile cat /home/nile/.ssh/id_ed25519.pub
# GitHub → repo → Settings → Deploy keys → Add deploy key → вставь → БЕЗ галки "Allow write access"
sudo -u nile ssh -T git@github.com   # first time: yes → "Hi …! You've successfully authenticated"
```
Альтернатива (HTTPS): fine-grained PAT с `Contents: Read` → `git config credential.helper store` один раз. Deploy key чище: ключ живёт только на сервере и только читает.

## 2. Первый clone + установка
```bash
sudo mkdir -p /opt-src && sudo chown $USER /opt-src
git clone git@github.com:<ТВОЙ-НИК>/nile-bites.git /opt-src/nilebites   # или https-URL
cd /opt-src/nilebites
sudo DOMAIN=192.168.1.50 bash server/install.sh     # см. DEPLOY-MINI.md: install.sh берёт файлы из cwd
```
Важно: install.sh/rsync ожидают запуск из корня репо — клонируй именно в `/opt-src/nilebites` и запускай оттуда. Рабочий код живёт в `/opt/nilebites/*` (копия), репо — источник.

## 3. Режим A — ручной pull (база)
```bash
cd /opt-src/nilebites && git pull --ff-only
sudo bash server/pull.sh     # fetch → behind? → tag pre-update → ff → update.sh (backup→migrate→build→restart)
```
`pull.sh` сам ставит тег `pre-update-YYYYMMDD-HHMM` перед каждым накатом — это твой rollback-якорь.

## 4. Режим B — cron-автоpull (сервер сам догоняет main)
```bash
sudo crontab -e   # root
*/10 * * * * cd /opt-src/nilebites && flock -n /tmp/nile-pull.lock bash server/pull.sh >> /var/log/nile-pull.log 2>&1
```
flock не даст двум апдейтам пересечься; лог смотришь при подозрениях. Push в main → ≤10 мин сервер живой на новой версии.

## 5. Режим C — GitHub Actions self-hosted runner (кнопка деплоя в GitHub)
Работает из-за NAT: runner сам ходит в GitHub, сервер ничего не открывает наружу.
```bash
# на сервере (user nile или отдельный runner):
mkdir -p ~/actions-runner && cd ~/actions-runner
curl -o runner.tar.gz -L https://github.com/actions/runner/releases/latest/download/actions-runner-linux-x64-2.322.0.tar.gz
tar xzf runner.tar.gz && ./config.sh --url https://github.com/<ТВОЙ-НИК>/nile-bites --token <RUNNER_TOKEN из Settings→Actions→Runners→New self-hosted runner> --labels nile-mini --unattended
sudo ./svc.sh install && sudo ./svc.sh start
# sudoers для runner-юзера (путь поправь под свой):
echo 'nile ALL=(root) NOPASSWD: /usr/bin/bash /opt-src/nilebites/server/pull.sh, /usr/bin/bash /opt-src/nilebites/server/update.sh, /usr/bin/systemctl restart nile-next, /usr/bin/systemctl reload nginx' | sudo tee /etc/sudoers.d/nile-deploy
```
Дальше: push в main (или tag `deploy-mini-*`, или кнопка Run workflow) → `.github/workflows/deploy-mini.yml` дёргает `server/pull.sh` на сервере и smoke-тестит health/web/demo. Статус виден в Actions.

## 6. Откат
```bash
cd /opt-src/nilebites && git tag -l 'pre-update-*' | tail -3
sudo bash -c 'git checkout pre-update-YYYYMMDD-HHMM && bash server/update.sh'   # код назад, БД не тронута
# БД-откат отдельно: restore из /backups/nile-*.dump (см. DEPLOY-MINI.md §5) — только если миграция ломала данные
```
Правило: миграции PG не откатываются git'ом — только новая миграция вперёд или restore дампа.

## 7. Чек-лист после любого деплоя
- [ ] `curl -s localhost/api/health` → ok, dbMs < 300
- [ ] `/admin/login` 200 и логин работает
- [ ] `/demo/` открывается; в консоли браузера `nb-api` указывает на твой хост
- [ ] SSE: /kds принимает стрим (два браузера + тест-заказ)
- [ ] `journalctl -u nile-next -n 30` без ошибок
- [ ] бэкап свежий: `ls -lh /backups | tail -1`

## 8. Куда смотреть, если что-то пошло не так
| Симптом | Где причина |
|---|---|
| Actions висит «queued» | runner офлайн: `sudo ./svc.sh status` на сервере |
| pull.sh: «not something we can merge» | локальные коммиты на сервере — не коммить в /opt-src руками; `git reset --hard origin/main` |
| update.sh: migrate fail | новая миграция конфликтует с ручными правками БД — только через prisma, не руками |
| после деплоя 502 | build не встал: `journalctl -u nile-next -n 50`, чаще всего OOM при <2GB RAM → собирай оффлайн (DEPLOY-MINI §1) |

*База по железу/сети/бэкапам — `server/DEPLOY-MINI.md`; прод-облако — `DEPLOY.md`.*
