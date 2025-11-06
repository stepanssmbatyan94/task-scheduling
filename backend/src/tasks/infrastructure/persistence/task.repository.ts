import { DeepPartial } from '../../../utils/types/deep-partial.type';
import { NullableType } from '../../../utils/types/nullable.type';
import { IPaginationOptions } from '../../../utils/types/pagination-options';
import { Task } from '../../domain/task';
import { FilterTaskDto, SortTaskDto } from '../../dto/query-task.dto';

export abstract class TaskRepository {
  abstract create(
    data: Omit<Task, 'id' | 'createdAt' | 'deletedAt' | 'updatedAt'>,
  ): Promise<Task>;

  abstract findManyWithPagination({
    filterOptions,
    sortOptions,
    paginationOptions,
  }: {
    filterOptions?: FilterTaskDto | null;
    sortOptions?: SortTaskDto[] | null;
    paginationOptions: IPaginationOptions;
  }): Promise<Task[]>;

  abstract findById(id: Task['id']): Promise<NullableType<Task>>;

  abstract findByAssignedUserAndDateRange(
    userId: number,
    startDate: Date,
    endDate: Date,
    excludeTaskId?: Task['id'],
  ): Promise<Task[]>;

  abstract update(
    id: Task['id'],
    payload: DeepPartial<Task>,
  ): Promise<Task | null>;

  abstract remove(id: Task['id']): Promise<void>;
}
