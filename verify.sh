#!/usr/bin/env bash
# Nile Bites — verification checker.
#   bash server/verify.sh repo    → проверить РЕПО (локально или на сервере): секреты/тяжёлое в git
#   sudo bash server/verify.sh    → проверить СЕРВЕР после деплоя: сервисы, URL, БД, SSE, бэкапы
set -uo pipefail
MODE=${1:-server}
PASS=0; FAIL=0
ok()   { PASS=$((PASS+1)); printf '  \033[32mPASS\033[0m  %s\n' "$1"; }
bad()  { FAIL=$((FAIL+1)); printf '  \033[31mFAIL\033[0m  %s\n' "$1"; }
info() { printf '  \033[33mINFO\033[0m  %s\n' "$1"; }
head() { printf '\n\033[1m== %s ==\033[0m\n' "$1"; }

# ---------------------------------------------------------------- REPO MODE
if [ "$MODE" = "repo" ]; then
  head "REPO HYGIENE (git)"
  command -v git >/dev/null || { bad "git not found"; exit 1; }
  git rev-parse --is-inside-work-tree >/dev/null 2>&1 || { bad "not a git repo here — run inside your clone"; exit 1; }

  if git log --all --oneline -- production/.env.local .env.local 2>/dev/null | grep -q .; then
    bad ".env.local IS IN HISTORY → rotate AUTH_SECRET/CRON_SECRET + Paymob keys NOW"
  else ok ".env.local not in history"; fi

  if git log --all --oneline -- '*.pem' 'id_ed25519' '*.key' 2>/dev/null | grep -q .; then
    bad "private keys in history → revoke them"
  else ok "no private keys in history"; fi

  for pat in node_modules .next "shots/"; do
    if git ls-files | grep -q "$pat"; then bad "$pat tracked in git (repo bloat)"; else ok "$pat not tracked"; fi
  done
  [ -f .gitignore ] && ok ".gitignore present" || bad ".gitignore missing"
  for f in index.html admin.html STRUCTURE.md HANDOVER.md DEPLOY.md server/install.sh production/prisma/schema.prisma; do
    git ls-files --error-unmatch "$f" >/dev/null 2>&1 && ok "tracked: $f" || bad "MISSING in repo: $f"
  done
  info "repo size: $(git count-objects -vH 2>/dev/null | grep size-pack | awk '{print $2}') (pack) / $(du -sh .git 2>/dev/null | cut -f1) (.git)"
  info "branch: $(git branch --show-current) @ $(git rev-parse --short HEAD) · remote: $(git remote get-url origin 2>/dev/null || echo none)"

# ---------------------------------------------------------------- SERVER MODE
else
  head "SERVICES"
  for svc in postgresql nginx nile-next; do
    systemctl is-active --quiet $svc && ok "$svc active" || bad "$svc NOT active (journalctl -u $svc -n 30)"
  done

  head "URLS"
  for u in /api/health / /admin/login /demo/ /demo/admin.html /robots.txt /sitemap.xml /locations/hurghada /ar /ru; do
    code=$(curl -s -o /dev/null -w "%{http_code}" --max-time 10 "http://127.0.0.1$u")
    [ "$code" = "200" ] && ok "$u → 200" || bad "$u → $code"
  done

  head "DATABASE"
  if command -v psql >/dev/null; then
    for t in Store Product Staff Order Outbox; do
      n=$(sudo -u postgres psql -tAc "SELECT COUNT(*) FROM \"$t\"" nilebites 2>/dev/null || PGPASSWORD=nile psql -h 127.0.0.1 -U nile -d nilebites -tAc "SELECT COUNT(*) FROM \"$t\"" 2>/dev/null)
      [ -n "$n" ] && ok "$t rows: $n" || bad "$t unreadable"
    done
  else bad "psql not found"; fi

  head "AUTH + SSE GUARDS"
  code=$(curl -s -o /dev/null -w "%{http_code}" --max-time 8 http://127.0.0.1/api/kds/stream)
  [ "$code" = "403" ] || [ "$code" = "401" ] && ok "kds stream rejects anonymous ($code)" || bad "kds stream open?! ($code)"
  code=$(curl -s -o /dev/null -w "%{http_code}" --max-time 8 http://127.0.0.1/admin)
  [ "$code" = "307" ] || [ "$code" = "302" ] && ok "/admin redirects to login ($code)" || info "/admin → $code (check manually)"
  login=$(curl -s --max-time 8 -X POST http://127.0.0.1/api/auth/login -H 'Content-Type: application/json' -d '{"email":"admin@nilebites.com","password":"Nile#2026"}')
  echo "$login" | grep -q '"token"' && info "seed admin login STILL WORKS — change password if internet-facing!" || ok "seed password already changed"

  head "SYSTEM"
  df -h / | awk 'NR==2{ if ($5+0 < 85) print "  \033[32mPASS\033[0m  disk usage "$5; else print "  \033[31mFAIL\033[0m  disk usage "$5 }'
  timedatectl 2>/dev/null | grep -q "synchronized: yes" && ok "time synced (KDS timers)" || info "time sync unknown"
  [ -d /backups ] && [ -n "$(ls -A /backups 2>/dev/null)" ] && ok "backups exist: $(ls /backups | tail -1)" || info "no backups yet (cron not set?)"
  grep -q "nb-api" /opt/nilebites/site/index.html 2>/dev/null && ok "concept bridge code present in /demo" || bad "concept on server lacks bridge"

  head "CRON / AUTO-UPDATE"
  crontab -l 2>/dev/null | grep -q "pull.sh" && ok "auto-pull cron installed" || info "no auto-pull cron (manual/runner mode?)"
  systemctl is-active --quiet nile-next && curl -sf --max-time 8 http://127.0.0.1/api/health | grep -q '"ok":true' && ok "end-to-end: web serves health from PG" || bad "health not ok"
fi

printf '\n\033[1mRESULT: %d passed, %d failed\033[0m\n' "$PASS" "$FAIL"
[ "$FAIL" = "0" ] && echo "ALL GREEN ✅" || echo "SEE FAILS ABOVE ⛔"
exit $([ "$FAIL" = "0" ] && echo 0 || echo 1)
