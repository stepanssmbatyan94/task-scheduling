import { Module } from '@nestjs/common';

import { TasksController } from './tasks.controller';

import { TasksService } from './tasks.service';
import { RelationalTaskPersistenceModule } from './infrastructure/persistence/relational/relational-persistence.module';
import { DatabaseConfig } from '../database/config/database-config.type';
import databaseConfig from '../database/config/database.config';

// <database-block>
const infrastructurePersistenceModule = (databaseConfig() as DatabaseConfig)
  .isDocumentDatabase
  ? null // Document database not implemented yet
  : RelationalTaskPersistenceModule;
// </database-block>

@Module({
  imports: [
    // import modules, etc.
    ...(infrastructurePersistenceModule
      ? [infrastructurePersistenceModule]
      : []),
  ],
  controllers: [TasksController],
  providers: [TasksService],
  exports: [
    TasksService,
    ...(infrastructurePersistenceModule
      ? [infrastructurePersistenceModule]
      : []),
  ],
})
export class TasksModule {}
