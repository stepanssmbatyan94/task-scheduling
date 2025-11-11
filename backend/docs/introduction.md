# Introduction

The Task Scheduling API is the service layer that powers real-time task coordination for the platform. It exposes REST and websocket endpoints for authenticating users, managing roles, planning work on Kanban boards, and synchronising assignments across teams.

## Key Responsibilities

- Authenticate users with email/password credentials, refresh tokens, and optional social providers.
- Manage organizations’ roles, permissions, user availability, and profile metadata.
- Serve CRUD APIs for tasks, task statuses, and scheduling rules while pushing board updates over websockets.
- Provide supporting services such as localization, transactional emails, and file handling for avatars and attachments.
- Offer operational tooling including migrations, seed data, smoke/e2e tests, and Docker-based local development.

---

Previous: [Main](readme.md)

Next: [Installing and Running](installing-and-running.md)
