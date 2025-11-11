import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Query,
  HttpStatus,
  HttpCode,
  SerializeOptions,
} from '@nestjs/common';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
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
import {
  InfinityPaginationResponse,
  InfinityPaginationResponseDto,
} from '../utils/dto/infinity-pagination-response.dto';
import { NullableType } from '../utils/types/nullable.type';
import { QueryTaskDto } from './dto/query-task.dto';
import { Task } from './domain/task';
import { TasksService } from './tasks.service';
import { RolesGuard } from '../roles/roles.guard';
import { infinityPagination } from '../utils/infinity-pagination';

@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'), RolesGuard)
@ApiTags('Tasks')
@Controller({
  path: 'tasks',
  version: '1',
})
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @ApiCreatedResponse({
    type: Task,
  })
  @SerializeOptions({
    groups: ['admin'],
  })
  @Roles(RoleEnum.admin)
  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Body() createTaskDto: CreateTaskDto): Promise<Task> {
    return this.tasksService.create(createTaskDto);
  }

  @ApiOkResponse({
    type: InfinityPaginationResponse(Task),
  })
  @SerializeOptions({
    groups: ['admin', 'user'],
  })
  @Roles(RoleEnum.admin, RoleEnum.user)
  @Get()
  @HttpCode(HttpStatus.OK)
  async findAll(
    @Query() query: QueryTaskDto,
  ): Promise<InfinityPaginationResponseDto<Task>> {
    const page = query?.page ?? 1;
    const limit = query?.limit ?? 20;

    const returnAll = limit === -1;

    const data = await this.tasksService.findManyWithPagination({
      filterOptions: query?.filters,
      sortOptions: query?.sort,
      paginationOptions: {
        page: returnAll ? 1 : page,
        limit: returnAll ? -1 : limit,
      },
    });

    return infinityPagination(data, {
      page: returnAll ? 1 : page,
      limit: returnAll ? data.length + 1 : limit,
    });
  }

  @ApiOkResponse({
    type: Task,
  })
  @SerializeOptions({
    groups: ['admin', 'user'],
  })
  @Roles(RoleEnum.admin, RoleEnum.user)
  @Get(':id')
  @HttpCode(HttpStatus.OK)
  @ApiParam({
    name: 'id',
    type: String,
    required: true,
  })
  findOne(@Param('id') id: Task['id']): Promise<NullableType<Task>> {
    return this.tasksService.findById(id);
  }

  @ApiOkResponse({
    type: Task,
  })
  @SerializeOptions({
    groups: ['admin', 'user'],
  })
  @Roles(RoleEnum.admin, RoleEnum.user)
  @Patch(':id')
  @HttpCode(HttpStatus.OK)
  @ApiParam({
    name: 'id',
    type: String,
    required: true,
  })
  update(
    @Param('id') id: Task['id'],
    @Body() updateTaskDto: UpdateTaskDto,
  ): Promise<Task | null> {
    return this.tasksService.update(id, updateTaskDto);
  }

  @Delete(':id')
  @ApiParam({
    name: 'id',
    type: String,
    required: true,
  })
  @Roles(RoleEnum.admin)
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id') id: Task['id']): Promise<void> {
    return this.tasksService.remove(id);
  }
}
