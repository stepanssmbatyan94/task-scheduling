# Command Line Interface (CLI)

---

## Generate resource

Use the Hygen generators bundled with the project to scaffold new modules that match the existing domain / infrastructure structure.

### Relational modules (TypeORM)

```bash
npm run generate:resource:relational -- --name ResourceName
# or
yarn generate:resource:relational --name ResourceName
```

This creates a folder under `src/<resource-name>/` with controller, service, domain entity, DTOs, relational entities, and repository adapters.

## Add property to resource

```bash
npm run add:property:to-relational
# or
yarn add:property:to-relational
```

Follow the prompts to generate new fields for the relational entity, mapper, and DTOs.

---

Previous: [Architecture](architecture.md)

Next: [Database](database.md)
