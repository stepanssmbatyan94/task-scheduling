import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TaskStatusEntity } from '../entities/task-status.entity';
import { TaskStatusRepository } from '../../task-status.repository';
import { TaskStatus } from '../../../../domain/task-status';
import { NullableType } from '../../../../../utils/types/nullable.type';

@Injectable()
export class TaskStatusRelationalRepository implements TaskStatusRepository {
  constructor(
    @InjectRepository(TaskStatusEntity)
    private readonly taskStatusRepository: Repository<TaskStatusEntity>,
  ) {}

  async create(data: Omit<TaskStatus, 'id'>): Promise<TaskStatus> {
    const entity = this.taskStatusRepository.create({
      name: data.name,
      order: data.order,
    });
    const savedEntity = await this.taskStatusRepository.save(entity);

    return {
      id: savedEntity.id,
      name: savedEntity.name,
      order: savedEntity.order,
    };
  }

  async findAll(): Promise<TaskStatus[]> {
    const entities = await this.taskStatusRepository.find({
      order: { order: 'ASC' },
    });

    return entities.map((entity) => ({
      id: entity.id,
      name: entity.name,
      order: entity.order,
    }));
  }

  async findById(id: TaskStatus['id']): Promise<NullableType<TaskStatus>> {
    const entity = await this.taskStatusRepository.findOne({
      where: { id: Number(id) },
    });

    if (!entity) {
      return null;
    }

    return {
      id: entity.id,
      name: entity.name,
      order: entity.order,
    };
  }

  async update(
    id: TaskStatus['id'],
    payload: Partial<Omit<TaskStatus, 'id'>>,
  ): Promise<TaskStatus | null> {
    const entity = await this.taskStatusRepository.findOne({
      where: { id: Number(id) },
    });

    if (!entity) {
      return null;
    }

    if (payload.name !== undefined) {
      entity.name = payload.name;
    }
    if (payload.order !== undefined) {
      entity.order = payload.order;
    }

    const updatedEntity = await this.taskStatusRepository.save(entity);

    return {
      id: updatedEntity.id,
      name: updatedEntity.name,
      order: updatedEntity.order,
    };
  }

  async remove(id: TaskStatus['id']): Promise<void> {
    await this.taskStatusRepository.delete(Number(id));
  }
}
