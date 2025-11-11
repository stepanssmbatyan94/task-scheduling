# Installation & Local Run

The Task Scheduling API relies on [MySQL](https://www.mysql.com/) via [TypeORM](https://typeorm.io/) and ships with scripts for migrations, seeds, and Docker-based infrastructure. You can target any TypeORM-supported relational database by adjusting the environment variables, but examples below assume MySQL.

---

## Table of Contents <!-- omit in toc -->

- [Comfortable development (MySQL + TypeORM)](#comfortable-development-mysql--typeorm)
  - [Video guideline](#video-guideline)
- [Quick run (MySQL + TypeORM)](#quick-run-mysql--typeorm)
- [Links](#links)

---

## Recommended development flow

1. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   ```

2. **Create a `.env` file** (see [backend README](../README.md) for required keys). Minimum configuration:
   ```env
   APP_PORT=3000
   API_PREFIX=api
   BACKEND_DOMAIN=http://localhost:3000
   FRONTEND_DOMAIN=http://localhost:5173

   DATABASE_TYPE=mysql
   DATABASE_HOST=localhost
   DATABASE_PORT=3306
   DATABASE_NAME=task_scheduling
   DATABASE_USERNAME=root
   DATABASE_PASSWORD=secret
   DATABASE_ROOT_PASSWORD=secret

   AUTH_JWT_SECRET=...
   AUTH_JWT_TOKEN_EXPIRES_IN=15m
   AUTH_REFRESH_SECRET=...
   AUTH_REFRESH_TOKEN_EXPIRES_IN=7d

   MAIL_HOST=localhost
   MAIL_PORT=1025
   MAIL_CLIENT_PORT=1080
   MAIL_DEFAULT_EMAIL=no-reply@taskscheduling.local
   MAIL_DEFAULT_NAME=Task Scheduling
   MAIL_IGNORE_TLS=true
   MAIL_SECURE=false
   MAIL_REQUIRE_TLS=false
   ```

3. **Start required services**
   - Local MySQL + Maildev (Adminer optional but helpful):
     ```bash
     docker compose up -d mysql maildev adminer
     ```
   - Or point `DATABASE_HOST` to an existing database.

4. **Run migrations and seed data**
   ```bash
   npm run migration:run
   npm run seed:run:relational
   ```

5. **Start the API**
   ```bash
   npm run start:dev
   ```
   Swagger is available at <http://localhost:3000/docs>.

---

## Quick start with Docker Compose

For an all-in-one local stack (API + MySQL + Maildev):

```bash
docker compose up -d
docker compose logs -f api  # optional watch
```

Ensure your `.env` matches the compose defaults (`DATABASE_HOST=mysql`, `MAIL_HOST=maildev`). The API will hot-reload when source files change if the compose profile mounts the project directory.

---

## Useful URLs

- Swagger UI: <http://localhost:3000/docs>
- Maildev inbox: <http://localhost:1080>
- Adminer (optional DB UI): <http://localhost:8080>

---

Previous: [Introduction](introduction.md)

Next: [Architecture](architecture.md)
