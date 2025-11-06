import { NullableType } from '../../../utils/types/nullable.type';
import { TaskStatus } from '../../domain/task-status';

export abstract class TaskStatusRepository {
  abstract create(data: Omit<TaskStatus, 'id'>): Promise<TaskStatus>;

  abstract findAll(): Promise<TaskStatus[]>;

  abstract findById(id: TaskStatus['id']): Promise<NullableType<TaskStatus>>;

  abstract update(
    id: TaskStatus['id'],
    payload: Partial<Omit<TaskStatus, 'id'>>,
  ): Promise<TaskStatus | null>;

  abstract remove(id: TaskStatus['id']): Promise<void>;
}
