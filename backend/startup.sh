#!/usr/bin/env bash
set -euo pipefail

MODE="${1:-dev}"

DB_HOST="${DATABASE_HOST:-mysql}"
DB_PORT="${DATABASE_PORT:-3306}"
MAIL_HOST="${MAIL_HOST:-maildev}"
MAIL_PORT="${MAIL_PORT:-1080}"
APP_PORT="${APP_PORT:-3000}"

wait_for() {
  local target=$1
  /opt/wait-for-it.sh "$target"
}

case "$MODE" in
  dev)
    wait_for "${DB_HOST}:${DB_PORT}"
    npm run migration:run
    npm run seed:run:relational
    npm run start:prod
    ;;
  test)
    wait_for "${DB_HOST}:${DB_PORT}"
    wait_for "${MAIL_HOST}:${MAIL_PORT}"
    npm install
    npm run migration:run
    npm run seed:run:relational
    npm run start:dev
    ;;
  ci)
    wait_for "${DB_HOST}:${DB_PORT}"
    npm run migration:run
    npm run seed:run:relational
    npm run start:prod > prod.log 2>&1 &
    wait_for "${MAIL_HOST}:${MAIL_PORT}"
    wait_for "localhost:${APP_PORT}"
    npm run lint
    npm run test:e2e -- --runInBand
    ;;
  *)
    echo "Unsupported startup mode: $MODE" >&2
    exit 1
    ;;
esac

