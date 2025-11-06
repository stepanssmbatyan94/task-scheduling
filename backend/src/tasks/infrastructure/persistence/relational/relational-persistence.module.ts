import { Module } from '@nestjs/common';
import { TaskRepository } from '../task.repository';
import { TasksRelationalRepository } from './repositories/task.repository';
import { TaskStatusRepository } from '../task-status.repository';
import { TaskStatusRelationalRepository } from './repositories/task-status.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TaskEntity } from './entities/task.entity';
import { TaskStatusEntity } from './entities/task-status.entity';

@Module({
  imports: [TypeOrmModule.forFeature([TaskEntity, TaskStatusEntity])],
  providers: [
    {
      provide: TaskRepository,
      useClass: TasksRelationalRepository,
    },
    {
      provide: TaskStatusRepository,
      useClass: TaskStatusRelationalRepository,
    },
  ],
  exports: [TaskRepository, TaskStatusRepository],
})
export class RelationalTaskPersistenceModule {}
