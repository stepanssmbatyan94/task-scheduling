import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsNumber,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { Transform, Type, plainToInstance } from 'class-transformer';
import { Task } from '../domain/task';
import { UserDto } from '../../users/dto/user.dto';
import { TaskStatusDto } from './task-status.dto';

export class FilterTaskDto {
  @ApiPropertyOptional({ type: String })
  @IsOptional()
  @IsString()
  search?: string | null;

  @ApiPropertyOptional({ type: () => UserDto })
  @IsOptional()
  @ValidateNested()
  @Type(() => UserDto)
  assignedUser?: UserDto | null;

  @ApiPropertyOptional({ type: () => UserDto, isArray: true })
  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => UserDto)
  assignedUsers?: UserDto[] | null;

  @ApiPropertyOptional({ type: () => TaskStatusDto })
  @IsOptional()
  @ValidateNested()
  @Type(() => TaskStatusDto)
  status?: TaskStatusDto | null;
}

export class SortTaskDto {
  @ApiProperty()
  @Type(() => String)
  @IsString()
  orderBy: keyof Task;

  @ApiProperty()
  @IsString()
  order: string;
}

export class QueryTaskDto {
  @ApiPropertyOptional()
  @Transform(({ value }) => (value ? Number(value) : 1))
  @IsNumber()
  @IsOptional()
  page?: number;

  @ApiPropertyOptional()
  @Transform(({ value }) => (value ? Number(value) : 20))
  @IsNumber()
  @IsOptional()
  limit?: number;

  @ApiPropertyOptional({ type: String })
  @IsOptional()
  @Transform(({ value }) =>
    value ? plainToInstance(FilterTaskDto, JSON.parse(value)) : undefined,
  )
  @ValidateNested()
  @Type(() => FilterTaskDto)
  filters?: FilterTaskDto | null;

  @ApiPropertyOptional({ type: String })
  @IsOptional()
  @Transform(({ value }) => {
    return value ? plainToInstance(SortTaskDto, JSON.parse(value)) : undefined;
  })
  @ValidateNested({ each: true })
  @Type(() => SortTaskDto)
  sort?: SortTaskDto[] | null;
}
