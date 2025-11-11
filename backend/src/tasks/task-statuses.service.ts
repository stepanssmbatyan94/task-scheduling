import {
  HttpStatus,
  Injectable,
  UnprocessableEntityException,
} from '@nestjs/common';
import { TaskStatusRepository } from './infrastructure/persistence/task-status.repository';
import { TaskStatus } from './domain/task-status';
import { CreateTaskStatusDto } from './dto/create-task-status.dto';
import { UpdateTaskStatusDto } from './dto/update-task-status.dto';
import { NullableType } from '../utils/types/nullable.type';

@Injectable()
export class TaskStatusesService {
  constructor(private readonly taskStatusRepository: TaskStatusRepository) {}

  async create(createTaskStatusDto: CreateTaskStatusDto): Promise<TaskStatus> {
    const existingStatuses = await this.taskStatusRepository.findAll();
    const duplicateName = existingStatuses.find(
      (status) => status.name === createTaskStatusDto.name,
    );

    if (duplicateName) {
      throw new UnprocessableEntityException({
        status: HttpStatus.UNPROCESSABLE_ENTITY,
        errors: {
          name: 'taskStatusNameAlreadyExists',
        },
      });
    }

    return this.taskStatusRepository.create({
      name: createTaskStatusDto.name,
      order: createTaskStatusDto.order,
    });
  }

  async findAll(): Promise<TaskStatus[]> {
    return this.taskStatusRepository.findAll();
  }

  async findById(id: TaskStatus['id']): Promise<NullableType<TaskStatus>> {
    return this.taskStatusRepository.findById(id);
  }

  async update(
    id: TaskStatus['id'],
    updateTaskStatusDto: UpdateTaskStatusDto,
  ): Promise<TaskStatus | null> {
    const existingStatus = await this.taskStatusRepository.findById(id);

    if (!existingStatus) {
      throw new UnprocessableEntityException({
        status: HttpStatus.UNPROCESSABLE_ENTITY,
        errors: {
          taskStatus: 'taskStatusNotFound',
        },
      });
    }

    if (updateTaskStatusDto.name) {
      const existingStatuses = await this.taskStatusRepository.findAll();
      const duplicateName = existingStatuses.find(
        (status) =>
          status.name === updateTaskStatusDto.name && status.id !== id,
      );

      if (duplicateName) {
        throw new UnprocessableEntityException({
          status: HttpStatus.UNPROCESSABLE_ENTITY,
          errors: {
            name: 'taskStatusNameAlreadyExists',
          },
        });
      }
    }

    return this.taskStatusRepository.update(id, updateTaskStatusDto);
  }

  async remove(id: TaskStatus['id']): Promise<void> {
    const existingStatus = await this.taskStatusRepository.findById(id);

    if (!existingStatus) {
      throw new UnprocessableEntityException({
        status: HttpStatus.UNPROCESSABLE_ENTITY,
        errors: {
          taskStatus: 'taskStatusNotFound',
        },
      });
    }

    await this.taskStatusRepository.remove(id);
  }
}
