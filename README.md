# Task Scheduling Platform

Task Scheduling is a two-part application for coordinating work across teams. It combines a NestJS REST API with a Vue 3 web client to handle user management, role-based access, Kanban-style planning, and task assignment.

## Projects
- [`backend`](backend/README.md) – NestJS API powering authentication, roles, task workflows, and supporting services (localization, mail, file storage).  
  _Setup & installation: see `backend/README.md`._
- [`frontend`](frontend/README.md) – Vue 3 single-page application with task boards, filters, and admin panels.  
  _Setup & installation: see `frontend/README.md`._
- [`backend/docs`](backend/docs/readme.md) – Backend reference for architecture decisions, CLI usage, and advanced topics.  
  _In-depth guides: start at `backend/docs/readme.md`._

## Quick Start
1. Install Node.js 20+ (ensures compatibility with both workspaces) and Docker if you intend to run MySQL locally via compose.
2. Clone the repository, then follow the setup steps in each project folder:
   ```
   cd backend  && npm install   # or yarn install
   cd ../frontend && npm install # or yarn install
   ```
3. Each service has detailed environment and run instructions inside `backend/README.md` and `frontend/README.md`.

## Repository Structure
```
.
├── backend/    # NestJS API and technical documentation
├── frontend/   # Vue web application
└── README.md   # Project overview and links
```

## Development Workflow
- Start with the backend README to configure database access, run migrations, and launch the API (`npm run start:dev`).
- Use the frontend README to configure environment variables and run the UI (`npm run dev`).
- The backend documentation folder contains detailed guides on architecture, authentication, database design, and operational tooling.

## Seed Accounts
Running the backend seed (`npm run seed:run:relational`) provisions ready-to-use users (see the backend documentation index for deeper setup notes [backend/docs](backend/docs/readme.md)):

- **Admin** – `admin@example.com` / `secret`  
  Full access to user management, task administration, and assignments.
- **Standard users** – all share password `secret`  
  - `john.doe@example.com`  
  - `jane.smith@example.com`  
  - `michael.johnson@example.com`  
  Additional demo users may be present (e.g., `emily.williams@example.com`, `david.brown@example.com`).

## Using the Application
- Sign in as the **admin** to create or edit tasks, manage users, assign work, and configure statuses.  
- Sign in as a **standard user** to create tasks, update their own work, and assign or reassign tasks they own (no access to user management).  
- Task assignments trigger realtime notifications over the Socket.IO channel so assignees see updates instantly.

## License
Both the backend and frontend are distributed under the MIT License (see `backend/LICENSE` and `frontend/LICENSE`).

