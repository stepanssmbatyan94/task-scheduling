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
import { TaskStatusEntity } from './task-status.entity';
import { UserAvailabilityEntity } from './user-availability.entity';
import { OneToOne } from 'typeorm';

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

  @ManyToOne(() => TaskStatusEntity, {
    eager: true,
  })
  @JoinColumn({ name: 'statusId' })
  status?: TaskStatusEntity;

  @Column({ nullable: true })
  statusId?: number | null;

  @OneToOne(() => UserAvailabilityEntity, (availability) => availability.task, {
    eager: true,
  })
  availability?: UserAvailabilityEntity | null;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;
}
