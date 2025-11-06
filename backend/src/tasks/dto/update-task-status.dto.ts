import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsNumber, IsOptional } from 'class-validator';

export class UpdateTaskStatusDto {
  @ApiPropertyOptional({
    type: String,
    example: 'backlog',
  })
  @IsString()
  @IsOptional()
  name?: string;

  @ApiPropertyOptional({
    type: Number,
    example: 1,
  })
  @IsNumber()
  @IsOptional()
  order?: number;
}
