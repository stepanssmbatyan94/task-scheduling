import { UserEntity } from '../../../../../users/infrastructure/persistence/relational/entities/user.entity';
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
    domainEntity.startDate = raw.startDate;
    domainEntity.endDate = raw.endDate;
    if (raw.assignedUser) {
      domainEntity.assignedUser = UserMapper.toDomain(raw.assignedUser);
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
    let assignedUser: UserEntity | undefined | null = undefined;

    if (domainEntity.assignedUser) {
      assignedUser = new UserEntity();
      assignedUser.id = Number(domainEntity.assignedUser.id);
    } else if (domainEntity.assignedUser === null) {
      assignedUser = null;
    }

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
    persistenceEntity.startDate = domainEntity.startDate;
    persistenceEntity.endDate = domainEntity.endDate;
    persistenceEntity.assignedUser = assignedUser;
    persistenceEntity.assignedUserId = assignedUser ? assignedUser.id : null;
    persistenceEntity.status = status;
    persistenceEntity.statusId = status ? status.id : null;
    persistenceEntity.createdAt = domainEntity.createdAt;
    persistenceEntity.updatedAt = domainEntity.updatedAt;
    persistenceEntity.deletedAt = domainEntity.deletedAt;
    return persistenceEntity;
  }
}
