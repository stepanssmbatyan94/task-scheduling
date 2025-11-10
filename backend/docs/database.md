# Database

## About databases

The boilerplate ships with a MySQL + TypeORM stack. You can point TypeORM to another relational driver, but all tooling, migrations, and Docker assets are aligned with MySQL.

## Working with database schema (TypeORM)

### Generate migration

1. Create entity file with extension `.entity.ts`. For example `post.entity.ts`:

   ```ts
   // /src/posts/infrastructure/persistence/relational/entities/post.entity.ts

   import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
   import { EntityRelationalHelper } from '../../../../../utils/relational-entity-helper';

   @Entity()
   export class Post extends EntityRelationalHelper {
     @PrimaryGeneratedColumn()
     id: number;

     @Column()
     title: string;

     @Column()
     body: string;

     // Here any fields that you need
   }
   ```

1. Next, generate migration file:

   ```bash
   npm run migration:generate -- src/database/migrations/CreatePostTable
   ```

1. Apply this migration to database via [npm run migration:run](#run-migration).

### Run migration

```bash
npm run migration:run
```

### Revert migration

```bash
npm run migration:revert
```

### Drop all tables in database

```bash
npm run schema:drop
```

---

## Seeding (TypeORM)

### Creating seeds (TypeORM)

1. Create seed file with `npm run seed:create:relational -- --name Post`. Where `Post` is name of entity.
1. Go to `src/database/seeds/relational/post/post-seed.service.ts`.
1. In `run` method extend your logic.
1. Run [npm run seed:run:relational](#run-seed-typeorm)

### Run seed (TypeORM)

```bash
npm run seed:run:relational
```

### Factory and Faker (TypeORM)

1. Install faker:

    ```bash
    npm i --save-dev @faker-js/faker
    ```

1. Create `src/database/seeds/relational/user/user.factory.ts`:

    ```ts
    import { faker } from '@faker-js/faker';
    import { RoleEnum } from '../../../../roles/roles.enum';
    import { StatusEnum } from '../../../../statuses/statuses.enum';
    import { Injectable } from '@nestjs/common';
    import { InjectRepository } from '@nestjs/typeorm';
    import { Repository } from 'typeorm';
    import { RoleEntity } from '../../../../roles/infrastructure/persistence/relational/entities/role.entity';
    import { UserEntity } from '../../../../users/infrastructure/persistence/relational/entities/user.entity';
    import { StatusEntity } from '../../../../statuses/infrastructure/persistence/relational/entities/status.entity';

    @Injectable()
    export class UserFactory {
      constructor(
        @InjectRepository(UserEntity)
        private repositoryUser: Repository<UserEntity>,
        @InjectRepository(RoleEntity)
        private repositoryRole: Repository<RoleEntity>,
        @InjectRepository(StatusEntity)
        private repositoryStatus: Repository<StatusEntity>,
      ) {}

      createRandomUser() {
        // Need for saving "this" context
        return () => {
          return this.repositoryUser.create({
            firstName: faker.person.firstName(),
            lastName: faker.person.lastName(),
            email: faker.internet.email(),
            password: faker.internet.password(),
            role: this.repositoryRole.create({
              id: RoleEnum.user,
              name: 'User',
            }),
            status: this.repositoryStatus.create({
              id: StatusEnum.active,
              name: 'Active',
            }),
          });
        };
      }
    }
    ```

1. Make changes in `src/database/seeds/relational/user/user-seed.service.ts`:

    ```ts
    // Some code here...
    import { UserFactory } from './user.factory';
    import { faker } from '@faker-js/faker';

    @Injectable()
    export class UserSeedService {
      constructor(
        // Some code here...
        private userFactory: UserFactory,
      ) {}

      async run() {
        // Some code here...

        await this.repository.save(
          faker.helpers.multiple(this.userFactory.createRandomUser(), {
            count: 5,
          }),
        );
      }
    }
    ```

1. Make changes in `src/database/seeds/relational/user/user-seed.module.ts`:

    ```ts
    import { Module } from '@nestjs/common';
    import { TypeOrmModule } from '@nestjs/typeorm';
    
    import { UserSeedService } from './user-seed.service';
    import { UserFactory } from './user.factory';

    import { UserEntity } from '../../../../users/infrastructure/persistence/relational/entities/user.entity';
    import { RoleEntity } from '../../../../roles/infrastructure/persistence/relational/entities/role.entity';
    import { StatusEntity } from '../../../../statuses/infrastructure/persistence/relational/entities/status.entity';

    @Module({
      imports: [TypeOrmModule.forFeature([UserEntity, Role, Status])],
      providers: [UserSeedService, UserFactory],
      exports: [UserSeedService, UserFactory],
    })
    export class UserSeedModule {}

    ```

1. Run seed:

    ```bash
    npm run seed:run
    ```

---

## Performance optimization (MySQL + TypeORM)

### Indexes and foreign keys

MySQL automatically creates indexes for primary keys but not for every foreign key column. Add targeted indexes when your queries filter or join on a foreign key to keep lookups fast.

### Connection pools

Control the pool size with the `DATABASE_MAX_CONNECTIONS` variable in your `.env`:

```txt
DATABASE_MAX_CONNECTIONS=25
```

The value feeds the underlying `mysql2` connection pool (`connectionLimit`). Tune it according to your deployment size and MySQL server configuration. See the [mysql2 pool documentation](https://sidorares.github.io/node-mysql2/docs#using-connection-pools) for more details.

---

Previous: [Command Line Interface](cli.md)

Next: [Auth](auth.md)
