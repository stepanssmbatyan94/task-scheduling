import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  HttpStatus,
  HttpCode,
  SerializeOptions,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';
import { Roles } from '../roles/roles.decorator';
import { RoleEnum } from '../roles/roles.enum';
import { AuthGuard } from '@nestjs/passport';
import { NullableType } from '../utils/types/nullable.type';
import { TaskStatus } from './domain/task-status';
import { TaskStatusesService } from './task-statuses.service';
import { RolesGuard } from '../roles/roles.guard';
import { CreateTaskStatusDto } from './dto/create-task-status.dto';
import { UpdateTaskStatusDto } from './dto/update-task-status.dto';

@ApiBearerAuth()
@Roles(RoleEnum.admin)
@UseGuards(AuthGuard('jwt'), RolesGuard)
@ApiTags('Task Statuses')
@Controller({
  path: 'task-statuses',
  version: '1',
})
export class TaskStatusesController {
  constructor(private readonly taskStatusesService: TaskStatusesService) {}

  @ApiCreatedResponse({
    type: TaskStatus,
  })
  @SerializeOptions({
    groups: ['admin'],
  })
  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(
    @Body() createTaskStatusDto: CreateTaskStatusDto,
  ): Promise<TaskStatus> {
    return this.taskStatusesService.create(createTaskStatusDto);
  }

  @ApiOkResponse({
    type: [TaskStatus],
  })
  @SerializeOptions({
    groups: ['admin'],
  })
  @Get()
  @HttpCode(HttpStatus.OK)
  findAll(): Promise<TaskStatus[]> {
    return this.taskStatusesService.findAll();
  }

  @ApiOkResponse({
    type: TaskStatus,
  })
  @SerializeOptions({
    groups: ['admin'],
  })
  @Get(':id')
  @HttpCode(HttpStatus.OK)
  @ApiParam({
    name: 'id',
    type: String,
    required: true,
  })
  findOne(
    @Param('id') id: TaskStatus['id'],
  ): Promise<NullableType<TaskStatus>> {
    return this.taskStatusesService.findById(id);
  }

  @ApiOkResponse({
    type: TaskStatus,
  })
  @SerializeOptions({
    groups: ['admin'],
  })
  @Patch(':id')
  @HttpCode(HttpStatus.OK)
  @ApiParam({
    name: 'id',
    type: String,
    required: true,
  })
  update(
    @Param('id') id: TaskStatus['id'],
    @Body() updateTaskStatusDto: UpdateTaskStatusDto,
  ): Promise<TaskStatus | null> {
    return this.taskStatusesService.update(id, updateTaskStatusDto);
  }

  @Delete(':id')
  @ApiParam({
    name: 'id',
    type: String,
    required: true,
  })
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id') id: TaskStatus['id']): Promise<void> {
    return this.taskStatusesService.remove(id);
  }
}
