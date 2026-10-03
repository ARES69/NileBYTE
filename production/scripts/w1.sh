#!/usr/bin/env bash
# Nile Bites — W1 day-1 bootstrap. Idempotent. Run from production/ root.
set -euo pipefail

echo "→ 1/6 install deps"
npm ci

echo "→ 2/6 env check"
test -f .env.local || { cp .env.example .env.local; echo "  created .env.local — FILL DATABASE_URL + AUTH_SECRET NOW"; }
grep -q 'DATABASE_URL="postgresql://user' .env.local && { echo "  !! DATABASE_URL still placeholder"; exit 1; } || true

echo "→ 3/6 prisma: generate + migrate + seed"
npx prisma generate
npx prisma migrate deploy
npx prisma db seed

echo "→ 4/6 sanity: dataset check (skip if no project yet)"
if [ -n "${SANITY_PROJECT_ID:-}" ]; then npx sanity dataset list || true; else echo "  skipped — create project in W1 Tue"; fi

echo "→ 5/6 lint + typecheck"
npm run lint

echo "→ 6/6 build + smoke"
npm run build
(npm run start &) ; sleep 4
curl -sf http://localhost:3000/ > /dev/null && echo "  home 200 ok"
curl -sf http://localhost:3000/admin/login > /dev/null && echo "  admin login 200 ok"
curl -sf http://localhost:3000/robots.txt | head -2

echo
echo "W1 day-1 done. Next: log in /admin/login (seed admin), create first store invite in /admin/stores."
echo "Acceptance gate → docs/W1-KICKOFF.md"
