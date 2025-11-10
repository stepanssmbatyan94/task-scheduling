import { Module } from '@nestjs/common';

import { TasksController } from './tasks.controller';
import { TaskStatusesController } from './task-statuses.controller';

import { TasksService } from './tasks.service';
import { TaskStatusesService } from './task-statuses.service';
import { RelationalTaskPersistenceModule } from './infrastructure/persistence/relational/relational-persistence.module';
import { TaskEventsGateway } from './gateways/task-events.gateway';

@Module({
  imports: [RelationalTaskPersistenceModule],
  controllers: [TasksController, TaskStatusesController],
  providers: [TasksService, TaskStatusesService, TaskEventsGateway],
  exports: [TasksService, TaskStatusesService, RelationalTaskPersistenceModule],
})
export class TasksModule {}
