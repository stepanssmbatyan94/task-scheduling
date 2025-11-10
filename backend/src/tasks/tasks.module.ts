import { Module } from '@nestjs/common';

import { TasksController } from './tasks.controller';
import { TaskStatusesController } from './task-statuses.controller';

import { TasksService } from './tasks.service';
import { TaskStatusesService } from './task-statuses.service';
import { RelationalTaskPersistenceModule } from './infrastructure/persistence/relational/relational-persistence.module';

@Module({
  imports: [RelationalTaskPersistenceModule],
  controllers: [TasksController, TaskStatusesController],
  providers: [TasksService, TaskStatusesService],
  exports: [TasksService, TaskStatusesService, RelationalTaskPersistenceModule],
})
export class TasksModule {}
