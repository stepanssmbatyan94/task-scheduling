import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

import { EntityRelationalHelper } from '../../../../../utils/relational-entity-helper';
import { UserEntity } from '../../../../../users/infrastructure/persistence/relational/entities/user.entity';
import { TaskEntity } from './task.entity';

@Entity({ name: 'user_availability' })
@Index('IDX_user_availability_range', ['userId', 'startDate', 'endDate'])
export class UserAvailabilityEntity extends EntityRelationalHelper {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'timestamp', nullable: true })
  startDate?: Date | null;

  @Column({ type: 'timestamp', nullable: true })
  endDate?: Date | null;

  @ManyToOne(() => UserEntity, {
    eager: true,
    nullable: true,
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'userId' })
  user?: UserEntity | null;

  @Column({ nullable: true })
  userId?: number | null;

  @OneToOne(() => TaskEntity, (task) => task.availability, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'taskId' })
  task: TaskEntity;

  @Column()
  taskId: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
