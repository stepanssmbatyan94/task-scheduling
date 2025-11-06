import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TaskStatusSeedService } from './task-status-seed.service';
import { TaskStatusEntity } from '../../../../tasks/infrastructure/persistence/relational/entities/task-status.entity';

@Module({
  imports: [TypeOrmModule.forFeature([TaskStatusEntity])],
  providers: [TaskStatusSeedService],
  exports: [TaskStatusSeedService],
})
export class TaskStatusSeedModule {}
