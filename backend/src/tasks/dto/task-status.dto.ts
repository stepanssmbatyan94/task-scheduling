import { ApiProperty } from '@nestjs/swagger';
import { IsNumber } from 'class-validator';

export class TaskStatusDto {
  @ApiProperty({ type: Number })
  @IsNumber()
  id: number;
}
