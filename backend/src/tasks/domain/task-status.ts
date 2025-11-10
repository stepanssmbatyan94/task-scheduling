import { ApiProperty } from '@nestjs/swagger';

export class TaskStatus {
  @ApiProperty({
    type: Number,
  })
  id: number;

  @ApiProperty({
    type: String,
    example: 'backlog',
  })
  name?: string;

  @ApiProperty({
    type: Number,
    example: 1,
    required: false,
  })
  order?: number;
}

