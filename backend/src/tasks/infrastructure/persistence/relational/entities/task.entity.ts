import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  Index,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  JoinColumn,
} from 'typeorm';
import { EntityRelationalHelper } from '../../../../../utils/relational-entity-helper';
import { UserEntity } from '../../../../../users/infrastructure/persistence/relational/entities/user.entity';
import { TaskStatusEntity } from './task-status.entity';

@Entity({
  name: 'task',
})
export class TaskEntity extends EntityRelationalHelper {
  @PrimaryGeneratedColumn()
  id: number;

  @Index()
  @Column({ type: String })
  title: string;

  @Column({ type: String, nullable: true })
  description?: string | null;

  @Index()
  @Column({ type: 'timestamp', nullable: true })
  startDate?: Date | null;

  @Index()
  @Column({ type: 'timestamp', nullable: true })
  endDate?: Date | null;

  @ManyToOne(() => UserEntity, {
    eager: true,
  })
  @JoinColumn({ name: 'assignedUserId' })
  assignedUser?: UserEntity | null;

  @Column({ nullable: true })
  assignedUserId?: number | null;

  @ManyToOne(() => TaskStatusEntity, {
    eager: true,
  })
  @JoinColumn({ name: 'statusId' })
  status?: TaskStatusEntity;

  @Column({ nullable: true })
  statusId?: number | null;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;
}
