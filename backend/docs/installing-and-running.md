# Installation

NestJS Boilerplate uses [TypeORM](https://www.npmjs.com/package/typeorm) with [MySQL](https://www.mysql.com/) out of the box. You can point it to a different relational database if required, but all shipped tooling assumes MySQL.

---

## Table of Contents <!-- omit in toc -->

- [Comfortable development (MySQL + TypeORM)](#comfortable-development-mysql--typeorm)
  - [Video guideline](#video-guideline)
- [Quick run (MySQL + TypeORM)](#quick-run-mysql--typeorm)
- [Links](#links)

---

## Comfortable development (MySQL + TypeORM)

1. Clone repository

   ```bash
   git clone --depth 1 https://github.com/brocoders/nestjs-boilerplate.git my-app
   ```

1. Go to folder, and copy `env-example` as `.env`.

   ```bash
   cd my-app/
   cp env-example .env
   ```

1. Update the `.env` file if you plan to run MySQL locally. For Docker-based development keep `DATABASE_HOST=mysql`. For direct local usage change it to `localhost`.

1. Start the infrastructure containers:

   ```bash
   docker compose up -d mysql adminer maildev
   ```

1. Install project dependencies:

   ```bash
   npm install
   ```

1. Run the one-time app configuration (skip on subsequent runs):

   ```bash
   npm run app:config
   ```

1. Run migrations:

   ```bash
   npm run migration:run
   ```

1. Seed baseline data:

   ```bash
   npm run seed:run:relational
   ```

1. Start the app in development mode:

   ```bash
   npm run start:dev
   ```

1. Open <http://localhost:3000>

### Video guideline

<https://github.com/user-attachments/assets/136a16aa-f94a-4b20-8eaf-6b4262964315>

> The video demonstrates the general bootstrap process. Swap the database-specific steps with the MySQL commands outlined above.

---

## Quick run (MySQL + TypeORM)

If you want a quick start, you can use the following commands:

1. Clone repository

   ```bash
   git clone --depth 1 https://github.com/brocoders/nestjs-boilerplate.git my-app
   ```

1. Go to folder, and copy `env-example` as `.env`.

   ```bash
   cd my-app/
   cp env-example .env
   ```

1. Run containers

   ```bash
   docker compose up -d
   ```

1. Check container logs (optional)

   ```bash
   docker compose logs
   ```

1. Open <http://localhost:3000>

---

## Links

- Swagger (API docs): <http://localhost:3000/docs>
- Adminer (client for DB): <http://localhost:8080>
- Maildev: <http://localhost:1080>

---

Previous: [Introduction](introduction.md)

Next: [Architecture](architecture.md)
