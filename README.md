# Task Scheduling Platform

Task Scheduling is a two-part application for coordinating work across teams. It combines a NestJS REST API with a Vue 3 web client to handle user management, role-based access, Kanban-style planning, and task assignment.

## Projects
- [`backend`](backend/README.md) – NestJS API that manages authentication, users, task status workflows, assignments, and supporting services such as localization, mailing, and file storage.
- [`frontend`](frontend/README.md) – Vue 3 single-page application that surfaces the scheduling experience with task boards, filters, and administration panels.
- [`backend/docs`](backend/docs/readme.md) – In-depth backend reference covering architecture decisions, setup details, CLI usage, and advanced topics.

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

## License
Both the backend and frontend are distributed under the MIT License (see `backend/LICENSE` and `frontend/LICENSE`).

