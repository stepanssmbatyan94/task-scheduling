import { Module } from '@nestjs/common';
import { TaskRepository } from '../task.repository';
import { TasksRelationalRepository } from './repositories/task.repository';
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
  ],
  exports: [TaskRepository],
})
export class RelationalTaskPersistenceModule {}
