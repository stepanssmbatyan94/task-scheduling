import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TaskStatusEntity } from '../../../../tasks/infrastructure/persistence/relational/entities/task-status.entity';

@Injectable()
export class TaskStatusSeedService {
  constructor(
    @InjectRepository(TaskStatusEntity)
    private repository: Repository<TaskStatusEntity>,
  ) {}

  async run() {
    const count = await this.repository.count();

    if (!count) {
      const statuses = [
        {
          name: 'backlog',
          order: 1,
        },
        {
          name: 'todo',
          order: 2,
        },
        {
          name: 'blocked',
          order: 3,
        },
        {
          name: 'in-progress',
          order: 4,
        },
        {
          name: 'done',
          order: 5,
        },
      ];
      await this.repository.save(
        statuses.map((status) => this.repository.create(status)),
      );
    }
  }
}
