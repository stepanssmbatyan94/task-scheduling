import { ApiProperty } from '@nestjs/swagger';
import { User } from '../../users/domain/user';
import { TaskStatus } from './task-status';

export class Task {
  @ApiProperty({
    type: Number,
  })
  id: number;

  @ApiProperty({
    type: String,
    example: 'Complete project documentation',
  })
  title: string;

  @ApiProperty({
    type: String,
    example: 'Write comprehensive documentation for the project',
    required: false,
  })
  description?: string | null;

  @ApiProperty({
    type: Date,
    example: '2025-01-15T00:00:00Z',
    required: false,
  })
  startDate?: Date | null;

  @ApiProperty({
    type: Date,
    example: '2025-01-20T00:00:00Z',
    required: false,
  })
  endDate?: Date | null;

  @ApiProperty({
    type: () => User,
  })
  assignedUser?: User | null;

  @ApiProperty({
    type: () => TaskStatus,
  })
  status?: TaskStatus;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;

  @ApiProperty()
  deletedAt: Date;
}
