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
import { UserAvailabilityEntity } from '../entities/user-availability.entity';
import { UserEntity } from '../../../../../users/infrastructure/persistence/relational/entities/user.entity';

@Injectable()
export class TasksRelationalRepository implements TaskRepository {
  constructor(
    @InjectRepository(TaskEntity)
    private readonly tasksRepository: Repository<TaskEntity>,
    @InjectRepository(UserAvailabilityEntity)
    private readonly availabilityRepository: Repository<UserAvailabilityEntity>,
  ) {}

  async create(data: Task): Promise<Task> {
    const persistenceModel = TaskMapper.toPersistence(data);
    const taskEntity = await this.tasksRepository.save(
      this.tasksRepository.create(persistenceModel),
    );

    await this.syncAvailability(taskEntity.id, data);

    const reloaded = await this.findById(taskEntity.id);

    if (!reloaded) {
      throw new Error('Task not found after creation');
    }

    return reloaded;
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
      .leftJoinAndSelect('task.availability', 'availability')
      .leftJoinAndSelect('availability.user', 'assignedUser')
      .leftJoinAndSelect('task.status', 'status');

    let hasWhereClause = false;
    const applyFilter = (
      clause: string,
      parameters: Record<string, unknown>,
    ) => {
      if (hasWhereClause) {
        queryBuilder.andWhere(clause, parameters);
      } else {
        queryBuilder.where(clause, parameters);
        hasWhereClause = true;
      }
    };

    if (filterOptions?.search) {
      applyFilter(
        '(task.title ILIKE :search OR task.description ILIKE :search)',
        { search: `%${filterOptions.search}%` },
      );
    }

    const assignedUserIds = new Set<number>();

    if (filterOptions?.assignedUser?.id) {
      assignedUserIds.add(Number(filterOptions.assignedUser.id));
    }

    if (filterOptions?.assignedUsers?.length) {
      filterOptions.assignedUsers.forEach((user) => {
        const numericId = Number(user.id);
        if (!Number.isNaN(numericId)) {
          assignedUserIds.add(numericId);
        }
      });
    }

    const assignedUserIdList = Array.from(assignedUserIds.values());

    if (assignedUserIdList.length > 0) {
      applyFilter('availability.userId IN (:...userIds)', {
        userIds: assignedUserIdList,
      });
    }

    if (filterOptions?.status?.id) {
      applyFilter('task.statusId = :statusId', {
        statusId: Number(filterOptions.status.id),
      });
    }

    if (sortOptions?.length) {
      sortOptions.forEach((sort) => {
        const order = sort.order.toUpperCase() as 'ASC' | 'DESC';

        if (sort.orderBy === 'startDate') {
          queryBuilder.addOrderBy('availability.startDate', order);
          return;
        }

        if (sort.orderBy === 'endDate') {
          queryBuilder.addOrderBy('availability.endDate', order);
          return;
        }

        if (sort.orderBy === 'assignedUser') {
          queryBuilder.addOrderBy('assignedUser.lastName', order);
          queryBuilder.addOrderBy('assignedUser.firstName', order);
          return;
        }

        queryBuilder.addOrderBy(`task.${sort.orderBy}`, order);
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
      relations: ['availability', 'availability.user', 'status'],
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
      .innerJoinAndSelect('task.availability', 'availability')
      .leftJoinAndSelect('availability.user', 'assignedUser')
      .leftJoinAndSelect('task.status', 'status')
      .where('availability.userId = :userId', { userId })
      .andWhere('availability.startDate IS NOT NULL')
      .andWhere('availability.endDate IS NOT NULL')
      .andWhere(
        '(availability.startDate <= :endDate AND availability.endDate >= :startDate)',
        {
          startDate,
          endDate,
        },
      );

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
      relations: ['availability', 'availability.user', 'status'],
    });

    if (!entity) {
      throw new Error('Task not found');
    }

    const toSave = TaskMapper.toPersistence({
      ...TaskMapper.toDomain(entity),
      ...payload,
    });

    const updatedEntity = await this.tasksRepository.save(
      this.tasksRepository.create({
        ...entity,
        ...toSave,
      }),
    );

    await this.syncAvailability(updatedEntity.id, {
      ...TaskMapper.toDomain(entity),
      ...payload,
    });

    const reloaded = await this.findById(updatedEntity.id);

    if (!reloaded) {
      throw new Error('Task not found after update');
    }

    return reloaded;
  }

  async remove(id: Task['id']): Promise<void> {
    await this.tasksRepository.softDelete(id);
  }

  private async syncAvailability(taskId: number, payload: Partial<Task>) {
    const existingAvailability = await this.availabilityRepository.findOne({
      where: { taskId },
      relations: ['user'],
    });

    const assignedUserId =
      payload.assignedUser === undefined
        ? (existingAvailability?.userId ?? null)
        : payload.assignedUser
          ? Number(payload.assignedUser.id)
          : null;

    const startDate =
      payload.startDate === undefined
        ? (existingAvailability?.startDate ?? null)
        : (payload.startDate ?? null);

    const endDate =
      payload.endDate === undefined
        ? (existingAvailability?.endDate ?? null)
        : (payload.endDate ?? null);

    if (!assignedUserId && !startDate && !endDate) {
      if (existingAvailability) {
        await this.availabilityRepository.remove(existingAvailability);
      }
      return;
    }

    const availabilityEntity =
      existingAvailability ??
      this.availabilityRepository.create({
        taskId,
      });

    availabilityEntity.userId = assignedUserId ?? null;
    availabilityEntity.user = assignedUserId
      ? ({ id: assignedUserId } as UserEntity)
      : null;
    availabilityEntity.startDate = startDate ?? null;
    availabilityEntity.endDate = endDate ?? null;

    await this.availabilityRepository.save(availabilityEntity);
  }
}
