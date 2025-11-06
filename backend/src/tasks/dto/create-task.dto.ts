import { Transform, Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsOptional,
  IsString,
  IsDate,
  ValidateNested,
  MinLength,
} from 'class-validator';
import { UserDto } from '../../users/dto/user.dto';
import { TaskStatusDto } from './task-status.dto';

export class CreateTaskDto {
  @ApiProperty({ example: 'Complete project documentation', type: String })
  @IsNotEmpty()
  @IsString()
  @MinLength(1)
  title: string;

  @ApiPropertyOptional({
    example: 'Write comprehensive documentation',
    type: String,
  })
  @IsOptional()
  @IsString()
  description?: string | null;

  @ApiPropertyOptional({ example: '2025-01-15T00:00:00Z', type: Date })
  @Transform(({ value }) => (value ? new Date(value) : undefined))
  @IsOptional()
  @IsDate()
  startDate?: Date | null;

  @ApiPropertyOptional({ example: '2025-01-20T00:00:00Z', type: Date })
  @Transform(({ value }) => (value ? new Date(value) : undefined))
  @IsOptional()
  @IsDate()
  endDate?: Date | null;

  @ApiPropertyOptional({ type: () => UserDto })
  @IsOptional()
  @ValidateNested()
  @Type(() => UserDto)
  assignedUser?: UserDto | null;

  @ApiProperty({ type: () => TaskStatusDto })
  @IsNotEmpty()
  @ValidateNested()
  @Type(() => TaskStatusDto)
  status: TaskStatusDto;
}
