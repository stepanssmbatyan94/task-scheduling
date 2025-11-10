import { UserMapper } from '../../../../../users/infrastructure/persistence/relational/mappers/user.mapper';
import { TaskStatusEntity } from '../entities/task-status.entity';
import { Task } from '../../../../domain/task';
import { TaskEntity } from '../entities/task.entity';

export class TaskMapper {
  static toDomain(raw: TaskEntity): Task {
    const domainEntity = new Task();
    domainEntity.id = raw.id;
    domainEntity.title = raw.title;
    domainEntity.description = raw.description;
    const availability = raw.availability;
    domainEntity.startDate = availability
      ? (availability.startDate ?? null)
      : null;
    domainEntity.endDate = availability ? (availability.endDate ?? null) : null;
    if (availability) {
      domainEntity.assignedUser = availability.user
        ? UserMapper.toDomain(availability.user)
        : null;
    }
    if (raw.status) {
      domainEntity.status = {
        id: raw.status.id,
        name: raw.status.name,
        order: raw.status.order,
      };
    }
    domainEntity.createdAt = raw.createdAt;
    domainEntity.updatedAt = raw.updatedAt;
    domainEntity.deletedAt = raw.deletedAt;
    return domainEntity;
  }

  static toPersistence(domainEntity: Task): TaskEntity {
    let status: TaskStatusEntity | undefined = undefined;

    if (domainEntity.status) {
      status = new TaskStatusEntity();
      status.id = Number(domainEntity.status.id);
    }

    const persistenceEntity = new TaskEntity();
    if (domainEntity.id && typeof domainEntity.id === 'number') {
      persistenceEntity.id = domainEntity.id;
    }
    persistenceEntity.title = domainEntity.title;
    persistenceEntity.description = domainEntity.description;
    persistenceEntity.status = status;
    persistenceEntity.statusId = status ? status.id : null;
    persistenceEntity.createdAt = domainEntity.createdAt;
    persistenceEntity.updatedAt = domainEntity.updatedAt;
    persistenceEntity.deletedAt = domainEntity.deletedAt;
    return persistenceEntity;
  }
}
