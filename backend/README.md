# Task Scheduling API

The Task Scheduling API powers authentication, user management, availability tracking, and the Kanban-style task board used by the web client. It is built with NestJS and TypeORM on top of MySQL and exposes both REST endpoints and realtime updates.

## Core Capabilities
- Email-based authentication with refresh tokens, password resets, and optional social providers (Apple, Google, Facebook).
- Role- and permission-based access for administrators, managers, and standard users.
- CRUD endpoints for tasks, task statuses, and user availability with socket notifications for board updates.
- Background services for localization, transactional emails, and file uploads (local or S3).
- Tooling for migrations, seed data, automated tests, and API documentation (Swagger).

## Technology Stack
- [NestJS 11](https://docs.nestjs.com/) with modular architecture and dependency injection.
- [TypeORM](https://typeorm.io/) with MySQL and CLI-based migrations.
- [Passport](https://www.passportjs.org/) strategies for JWT and social login.
- [Socket.IO](https://socket.io/) gateway for live task updates.
- [nestjs-i18n](https://github.com/toonvanstrijp/nestjs-i18n) for multi-language support.
- [Jest](https://jestjs.io/) for unit and e2e tests.

## Prerequisites
- Node.js 20+ and npm 10+.
- MySQL 8 (local instance or Docker container).
- Optional: Docker for running the infrastructure stack defined in `docker-compose.yaml`.

## Setup

### 1. Install dependencies
```sh
npm install
```

### 2. Configure environment variables
Create a `.env` file in the `backend` directory. The API validates required keys on boot. Minimum configuration:

```env
# Application
APP_PORT=3000
API_PREFIX=api
FRONTEND_DOMAIN=http://localhost:5173
BACKEND_DOMAIN=http://localhost:3000

# Database (alternatively provide DATABASE_URL)
DATABASE_TYPE=mysql
DATABASE_HOST=localhost
DATABASE_PORT=3306
DATABASE_NAME=task_scheduling
DATABASE_USERNAME=root
DATABASE_PASSWORD=secret

# JWT & token lifetimes
AUTH_JWT_SECRET=replace-with-secure-value
AUTH_JWT_TOKEN_EXPIRES_IN=15m
AUTH_REFRESH_SECRET=replace-with-secure-value
AUTH_REFRESH_TOKEN_EXPIRES_IN=7d
AUTH_FORGOT_SECRET=replace-with-secure-value
AUTH_FORGOT_TOKEN_EXPIRES_IN=1h
AUTH_CONFIRM_EMAIL_SECRET=replace-with-secure-value
AUTH_CONFIRM_EMAIL_TOKEN_EXPIRES_IN=1d

# Mailer
MAIL_HOST=localhost
MAIL_PORT=1025
MAIL_USER=
MAIL_PASSWORD=
MAIL_DEFAULT_EMAIL=no-reply@taskscheduling.local
MAIL_DEFAULT_NAME=Task Scheduling
MAIL_IGNORE_TLS=true
MAIL_SECURE=false
MAIL_REQUIRE_TLS=false
```

Optional providers (Apple, Google, Facebook), S3 credentials, and other advanced settings are defined in `src/**/config/*.config.ts`.

### 3. Prepare the database
```sh
npm run migration:run
npm run seed:run:relational
```

### 4. Run the API
```sh
npm run start:dev
```

The service listens on `http://localhost:3000`. Swagger documentation is available at `http://localhost:3000/docs`.

### Docker workflow
To start MySQL, Maildev, and the API together:
```sh
docker compose up -d
```

## Scripts
| Script | Description |
| ------ | ----------- |
| `npm run start:dev` | Start the API in watch mode. |
| `npm run start:prod` | Run the prebuilt application from `dist/`. |
| `npm run build` | Compile TypeScript to `dist/`. |
| `npm run migration:run` | Apply database migrations. |
| `npm run seed:run:relational` | Seed baseline data (roles, statuses, demo users). |
| `npm run lint` | Lint the codebase with ESLint. |
| `npm run test` | Run unit tests. |
| `npm run test:e2e` | Execute end-to-end tests (requires database). |

## Documentation
- [Architecture, operations, and advanced guides](docs/readme.md)
- [Project overview and frontend entry point](../README.md)
