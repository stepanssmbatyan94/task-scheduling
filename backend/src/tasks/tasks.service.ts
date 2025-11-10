import {
  HttpStatus,
  Injectable,
  UnprocessableEntityException,
} from '@nestjs/common';
import { CreateTaskDto } from './dto/create-task.dto';
import { NullableType } from '../utils/types/nullable.type';
import { FilterTaskDto, SortTaskDto } from './dto/query-task.dto';
import { TaskRepository } from './infrastructure/persistence/task.repository';
import { Task } from './domain/task';
import { IPaginationOptions } from '../utils/types/pagination-options';
import { UpdateTaskDto } from './dto/update-task.dto';
import { TaskStatus } from './domain/task-status';
import { User } from '../users/domain/user';

@Injectable()
export class TasksService {
  constructor(private readonly tasksRepository: TaskRepository) {}

  async create(createTaskDto: CreateTaskDto): Promise<Task> {
    if (createTaskDto.startDate && createTaskDto.endDate) {
      if (createTaskDto.endDate < createTaskDto.startDate) {
        throw new UnprocessableEntityException({
          status: HttpStatus.UNPROCESSABLE_ENTITY,
          errors: {
            endDate: 'endDateMustBeAfterStartDate',
          },
        });
      }
    }

    if (
      createTaskDto.assignedUser?.id &&
      createTaskDto.startDate &&
      createTaskDto.endDate
    ) {
      const overlappingTasks =
        await this.tasksRepository.findByAssignedUserAndDateRange(
          Number(createTaskDto.assignedUser.id),
          createTaskDto.startDate,
          createTaskDto.endDate,
        );

      if (overlappingTasks.length > 0) {
        throw new UnprocessableEntityException({
          status: HttpStatus.UNPROCESSABLE_ENTITY,
          errors: {
            assignedUser: 'userHasOverlappingTask',
          },
        });
      }
    }

    const assignedUser: User | undefined = createTaskDto.assignedUser
      ? ({
          id: createTaskDto.assignedUser.id,
        } as User)
      : undefined;

    const status: TaskStatus | undefined = createTaskDto.status
      ? ({
          id: createTaskDto.status.id,
        } as TaskStatus)
      : undefined;

    return this.tasksRepository.create({
      title: createTaskDto.title,
      description: createTaskDto.description,
      startDate: createTaskDto.startDate,
      endDate: createTaskDto.endDate,
      assignedUser,
      status,
    });
  }

  findManyWithPagination({
    filterOptions,
    sortOptions,
    paginationOptions,
  }: {
    filterOptions?: FilterTaskDto | null;
    sortOptions?: SortTaskDto[] | null;
    paginationOptions: IPaginationOptions;
  }): Promise<Task[]> {
    return this.tasksRepository.findManyWithPagination({
      filterOptions,
      sortOptions,
      paginationOptions,
    });
  }

  findById(id: Task['id']): Promise<NullableType<Task>> {
    return this.tasksRepository.findById(id);
  }

  async update(
    id: Task['id'],
    updateTaskDto: UpdateTaskDto,
  ): Promise<Task | null> {
    const existingTask = await this.tasksRepository.findById(id);

    if (!existingTask) {
      throw new UnprocessableEntityException({
        status: HttpStatus.UNPROCESSABLE_ENTITY,
        errors: {
          task: 'taskNotFound',
        },
      });
    }

    // Validate date range if dates are being updated
    const startDate =
      updateTaskDto.startDate !== undefined
        ? updateTaskDto.startDate
        : existingTask.startDate;
    const endDate =
      updateTaskDto.endDate !== undefined
        ? updateTaskDto.endDate
        : existingTask.endDate;

    if (startDate && endDate && endDate < startDate) {
      throw new UnprocessableEntityException({
        status: HttpStatus.UNPROCESSABLE_ENTITY,
        errors: {
          endDate: 'endDateMustBeAfterStartDate',
        },
      });
    }

    // Check for overlapping tasks if user is being assigned or reassigned and dates are provided
    let assignedUserId: number | null;

    if (updateTaskDto.assignedUser === null) {
      assignedUserId = null;
    } else if (updateTaskDto.assignedUser?.id) {
      assignedUserId = Number(updateTaskDto.assignedUser.id);
    } else {
      assignedUserId = existingTask.assignedUser
        ? Number(existingTask.assignedUser.id)
        : null;
    }

    if (assignedUserId && startDate && endDate) {
      const overlappingTasks =
        await this.tasksRepository.findByAssignedUserAndDateRange(
          assignedUserId,
          startDate,
          endDate,
          id, // Exclude current task
        );

      if (overlappingTasks.length > 0) {
        throw new UnprocessableEntityException({
          status: HttpStatus.UNPROCESSABLE_ENTITY,
          errors: {
            assignedUser: 'userHasOverlappingTask',
          },
        });
      }
    }

    const assignedUser: User | undefined | null = updateTaskDto.assignedUser
      ? ({
          id: updateTaskDto.assignedUser.id,
        } as User)
      : updateTaskDto.assignedUser === null
        ? null
        : existingTask.assignedUser
          ? ({
              id: existingTask.assignedUser.id,
            } as User)
          : undefined;

    const status: TaskStatus | undefined = updateTaskDto.status
      ? ({
          id: updateTaskDto.status.id,
        } as TaskStatus)
      : existingTask.status
        ? ({
            id: existingTask.status.id,
          } as TaskStatus)
        : undefined;

    return this.tasksRepository.update(id, {
      title: updateTaskDto.title,
      description: updateTaskDto.description,
      startDate,
      endDate,
      assignedUser,
      status,
    });
  }

  async remove(id: Task['id']): Promise<void> {
    await this.tasksRepository.remove(id);
  }
}
