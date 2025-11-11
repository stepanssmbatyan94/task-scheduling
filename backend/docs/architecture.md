# Architecture

---

## Table of Contents <!-- omit in toc -->

- [Hexagonal Architecture](#hexagonal-architecture)
- [Module layout](#module-layout)
- [Working with repositories](#working-with-repositories)
- [FAQ](#faq)
  - [Is there a way to generate a new resource (controller, service, DTOs, etc) with Hexagonal Architecture?](#is-there-a-way-to-generate-a-new-resource-controller-service-dtos-etc-with-hexagonal-architecture)
- [Links](#links)

---

## Hexagonal Architecture

The service follows [Hexagonal Architecture](https://en.wikipedia.org/wiki/Hexagonal_architecture_(software)) to keep business logic, persistence, and delivery concerns isolated. Controllers expose REST/websocket ports, services encapsulate domain rules (e.g., scheduling constraints, role checks), and adapters connect to infrastructure pieces such as TypeORM repositories, mailers, and file storage.

## Module layout

Each feature in `src/` is organised by module (`tasks`, `users`, `statuses`, `session`, etc.) and follows a consistent structure:

Core modules:
- `auth`, `auth-apple`, `auth-facebook`, `auth-google` – authentication providers and refresh/session logic.
- `tasks` – task CRUD, Kanban board socket gateway, assignment operations.
- `statuses` – canonical task workflow statuses.
- `users`, `roles`, `session` – account management, authorization, and session persistence.
- `files`, `mail`, `mailer` – infrastructure adapters for storage and email delivery.
- `i18n` – locale resources for transactional emails and server responses.

```txt
.
├── domain
│   └── [DOMAIN_ENTITY].ts
├── dto
│   ├── create.dto.ts
│   ├── find-all.dto.ts
│   └── update.dto.ts
├── infrastructure
│   └── persistence
│       ├── relational
│       │   ├── entities
│       │   │   └── [ENTITY].ts
│       │   ├── mappers
│       │   │   └── [MAPPER].ts
│       │   ├── relational-persistence.module.ts
│       │   └── repositories
│       │       └── [ADAPTER].repository.ts
│       └── [PORT].repository.ts
├── controller.ts
├── module.ts
└── service.ts
```

Key points:

- `domain/` captures the business entity or aggregate used by services and gateways.
- `infrastructure/persistence` implements repository adapters (relational by default). Each adapter maps between database entities and domain objects.
- Controllers live at the module root and orchestrate DTO validation, guards, and service calls.
- `tasks/gateways` hosts the Socket.IO gateway that streams task updates to the frontend board.

## Working with repositories

Prefer explicit repository methods over generic arguments so the intent stays clear and adapters remain easy to evolve. For example:

```typescript
// ❌
export class UsersRelationalRepository implements UserRepository {
  async find(condition: UniversalConditionInterface): Promise<User> {
    // ...
  }
}

// ✅
export class UsersRelationalRepository implements UserRepository {
  async findByEmail(email: string): Promise<User> {
    // ...
  }
  
  async findByRoles(roles: string[]): Promise<User> {
    // ...
  }
  
  async findByIds(ids: string[]): Promise<User> {
    // ...
  }
}
```

---

## FAQ

### Is there a way to generate a new resource (controller, service, DTOs, etc) with Hexagonal Architecture?

Yes. Use the hygen-based scripts described in the [CLI guide](cli.md) to scaffold relational resources that follow this structure.

---

## Links

- [Dependency Inversion Principle](https://trilon.io/blog/dependency-inversion-principle) with NestJS

---

Previous: [Installing and Running](installing-and-running.md)

Next: [Command Line Interface](cli.md)
