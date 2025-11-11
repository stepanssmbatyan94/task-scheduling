# Task Scheduling Web App

The Task Scheduling web client is a Vue 3 single-page application that connects to the NestJS API to manage teams, schedules, and task boards. It offers Kanban planning, rich filtering, role-based permissions, and localized UI copy in English and Russian.

## Core Features
- Secure authentication flow with guarded routes and automatic redirects after login.
- Task board with Kanban lanes, drag-and-drop status changes, assignment controls, and debounce-based search filters.
- User and role management screens backed by permissions and reusable data table components.
- Toast notifications, confirmation modals, and optimistic feedback for critical actions.
- Localization with instant language switching and shared breadcrumb/navigation components.

## Technology Stack
- Vue 3 + Vite + TypeScript
- Pinia for shared state and stores (auth, current user)
- Vue Router for private/public route control
- PrimeVue, Element Plus, and Tailwind CSS for UI widgets and styling
- TanStack Query for server state and caching
- Socket.IO client for live task updates
- VeeValidate + Zod for form schema validation

## Prerequisites
- Node.js 20+
- npm 10+ (or pnpm/yarn if you prefer, but scripts below assume npm)
- Backend API running locally (see `../backend/README.md`)

## Getting Started
1. Install dependencies:
   ```sh
   npm install
   ```
2. Create a `.env` (or `.env.local`) file in the `frontend` directory:
   ```env
   APP_BASE_PATH=/
   API_BASE_URL=http://localhost:3000/api/v1
   SOCKET_BASE_URL=http://localhost:3000
   ```
   Additional keys from `src/config/env.ts` can be provided as needed (e.g., `MOCK_API=true` for mocked responses).
3. Start the development server:
   ```sh
   npm run dev
   ```
   Navigate to `http://localhost:5173`. The app proxies API calls to the backend using the configured `API_BASE_URL`.

### Linting, Building, and Preview
| Command | Description |
| ------- | ----------- |
| `npm run lint` | Lint and attempt to fix issues via ESLint. |
| `npm run build` | Type-check and build a production bundle. |
| `npm run preview` | Preview the built application locally. |
| `npm run format` | Format the source code with Prettier. |

## Project Structure
```
src/
├── components/         # Shared UI building blocks
├── composables/        # Reusable hooks (translation, debounced refs, etc.)
├── constants/          # Route names, permissions, menu definitions
├── layouts/            # Master layout shells and navigation
├── locales/            # i18n dictionaries (en, ru)
├── modules/
│   ├── auth/           # Login form and auth store
│   ├── current-user/   # Pulls authenticated user profile
│   ├── tasks/          # Task board, modals, and related composables
│   └── user-management/# User + role CRUD pages and helpers
├── router/             # Public/private route definitions
└── services/           # Axios configuration, API helpers
```

## Related Documentation
- Backend API setup and endpoints: [`../backend/README.md`](../backend/README.md)
- Architecture and deep dives: [`../backend/docs/readme.md`](../backend/docs/readme.md)
- Repository overview: [`../README.md`](../README.md)
