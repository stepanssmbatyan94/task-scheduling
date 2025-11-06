import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TaskEntity } from '../entities/task.entity';
import { NullableType } from '../../../../../utils/types/nullable.type';
import { FilterTaskDto, SortTaskDto } from '../../../../dto/query-task.dto';
import { Task } from '../../../../domain/task';
import { TaskRepository } from '../../task.repository';
import { TaskMapper } from '../mappers/task.mapper';
import { IPaginationOptions } from '../../../../../utils/types/pagination-options';

@Injectable()
export class TasksRelationalRepository implements TaskRepository {
  constructor(
    @InjectRepository(TaskEntity)
    private readonly tasksRepository: Repository<TaskEntity>,
  ) {}

  async create(data: Task): Promise<Task> {
    const persistenceModel = TaskMapper.toPersistence(data);
    const newEntity = await this.tasksRepository.save(
      this.tasksRepository.create(persistenceModel),
    );
    return TaskMapper.toDomain(newEntity);
  }

  async findManyWithPagination({
    filterOptions,
    sortOptions,
    paginationOptions,
  }: {
    filterOptions?: FilterTaskDto | null;
    sortOptions?: SortTaskDto[] | null;
    paginationOptions: IPaginationOptions;
  }): Promise<Task[]> {
    const queryBuilder = this.tasksRepository
      .createQueryBuilder('task')
      .leftJoinAndSelect('task.assignedUser', 'assignedUser')
      .leftJoinAndSelect('task.status', 'status');

    if (filterOptions?.search) {
      queryBuilder.where(
        '(task.title ILIKE :search OR task.description ILIKE :search)',
        { search: `%${filterOptions.search}%` },
      );
    }

    if (filterOptions?.assignedUser?.id) {
      if (filterOptions?.search) {
        queryBuilder.andWhere('task.assignedUserId = :userId', {
          userId: Number(filterOptions.assignedUser.id),
        });
      } else {
        queryBuilder.where('task.assignedUserId = :userId', {
          userId: Number(filterOptions.assignedUser.id),
        });
      }
    }

    if (filterOptions?.status?.id) {
      if (filterOptions?.search || filterOptions?.assignedUser?.id) {
        queryBuilder.andWhere('task.statusId = :statusId', {
          statusId: Number(filterOptions.status.id),
        });
      } else {
        queryBuilder.where('task.statusId = :statusId', {
          statusId: Number(filterOptions.status.id),
        });
      }
    }

    if (sortOptions?.length) {
      sortOptions.forEach((sort) => {
        queryBuilder.addOrderBy(
          `task.${sort.orderBy}`,
          sort.order.toUpperCase() as 'ASC' | 'DESC',
        );
      });
    } else {
      queryBuilder.orderBy('task.createdAt', 'DESC');
    }

    // If limit is -1, skip pagination and return all results
    if (paginationOptions.limit !== -1) {
      queryBuilder
        .skip((paginationOptions.page - 1) * paginationOptions.limit)
        .take(paginationOptions.limit);
    }

    const entities = await queryBuilder.getMany();

    return entities.map((task) => TaskMapper.toDomain(task));
  }

  async findById(id: Task['id']): Promise<NullableType<Task>> {
    const entity = await this.tasksRepository.findOne({
      where: { id: Number(id) },
      relations: ['assignedUser', 'status'],
    });

    return entity ? TaskMapper.toDomain(entity) : null;
  }

  async findByAssignedUserAndDateRange(
    userId: number,
    startDate: Date,
    endDate: Date,
    excludeTaskId?: Task['id'],
  ): Promise<Task[]> {
    const queryBuilder = this.tasksRepository
      .createQueryBuilder('task')
      .leftJoinAndSelect('task.assignedUser', 'assignedUser')
      .leftJoinAndSelect('task.status', 'status')
      .where('task.assignedUserId = :userId', { userId })
      .andWhere('task.startDate IS NOT NULL')
      .andWhere('task.endDate IS NOT NULL')
      .andWhere('(task.startDate <= :endDate AND task.endDate >= :startDate)', {
        startDate,
        endDate,
      });

    if (excludeTaskId) {
      queryBuilder.andWhere('task.id != :excludeTaskId', {
        excludeTaskId: Number(excludeTaskId),
      });
    }

    const entities = await queryBuilder.getMany();

    return entities.map((task) => TaskMapper.toDomain(task));
  }

  async update(id: Task['id'], payload: Partial<Task>): Promise<Task> {
    const entity = await this.tasksRepository.findOne({
      where: { id: Number(id) },
      relations: ['assignedUser', 'status'],
    });

    if (!entity) {
      throw new Error('Task not found');
    }

    const updatedEntity = await this.tasksRepository.save(
      this.tasksRepository.create(
        TaskMapper.toPersistence({
          ...TaskMapper.toDomain(entity),
          ...payload,
        }),
      ),
    );

    return TaskMapper.toDomain(updatedEntity);
  }

  async remove(id: Task['id']): Promise<void> {
    await this.tasksRepository.softDelete(id);
  }
}
