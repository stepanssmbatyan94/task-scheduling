#!/usr/bin/env bash
set -euo pipefail

MODE="${1:-dev}"

wait_for() {
  local target=$1
  /opt/wait-for-it.sh "$target"
}

case "$MODE" in
  dev)
    wait_for postgres:5432
    npm run migration:run
    npm run seed:run:relational
    npm run start:prod
    ;;
  test)
    wait_for postgres:5432
    wait_for maildev:1080
    npm install
    npm run migration:run
    npm run seed:run:relational
    npm run start:dev
    ;;
  ci)
    wait_for postgres:5432
    npm run migration:run
    npm run seed:run:relational
    npm run start:prod > prod.log 2>&1 &
    wait_for maildev:1080
    wait_for localhost:3000
    npm run lint
    npm run test:e2e -- --runInBand
    ;;
  *)
    echo "Unsupported startup mode: $MODE" >&2
    exit 1
    ;;
esac

