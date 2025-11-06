import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TaskSeedService } from './task-seed.service';
import { TaskEntity } from '../../../../tasks/infrastructure/persistence/relational/entities/task.entity';
import { TaskStatusEntity } from '../../../../tasks/infrastructure/persistence/relational/entities/task-status.entity';
import { UserEntity } from '../../../../users/infrastructure/persistence/relational/entities/user.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([TaskEntity, TaskStatusEntity, UserEntity]),
  ],
  providers: [TaskSeedService],
  exports: [TaskSeedService],
})
export class TaskSeedModule {}
