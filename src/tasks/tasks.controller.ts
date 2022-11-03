import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
  BadRequestException,
} from '@nestjs/common';
import { TasksService } from './tasks.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { GetTasksFilterDto } from './dto/get-tasks-filter.dto';
import { UpdateTaskStatusDto } from './dto/update-task-status.dto';
import { Task } from './task.entity';
import { AuthGuard } from '@nestjs/passport';
import { User } from '../auth/user.entity';
import { GetUser } from '../auth/get-user.decorator';
import { isUUID } from 'class-validator';

@Controller('tasks')
@UseGuards(AuthGuard())
export class TasksController {
  constructor(private tasksService: TasksService) {}

  @Get()
  async getTasks(
    @Query() filterDto: GetTasksFilterDto,
    @GetUser() user: User,
  ): Promise<Task[]> {
    return this.tasksService.getTasks(filterDto, user);
  }

  @Post()
  public async createTask(
    @Body() createTaskDto: CreateTaskDto,
    @GetUser() user: User,
  ): Promise<Task> {
    return this.tasksService.createTask(createTaskDto, user);
  }

  @Get('/:id')
  public async getTaskById(
    @Param('id') id: string,
    @GetUser() user: User,
  ): Promise<Task> {
    if (!isUUID(id)) {
      throw new BadRequestException(
        `Invalid id, UUID format expected but received ${id}`,
      );
    }
    return this.tasksService.getTaskById(id, user);
  }

  @Delete('/:id')
  deleteTask(@Param('id') id: string, @GetUser() user: User): void {
    if (!isUUID(id)) {
      throw new BadRequestException(
        `Invalid id, UUID format expected but received ${id}`,
      );
    }
    this.tasksService.deleteTask(id, user);
  }

  @Patch('/:id/status')
  public async updateTaskStatus(
    @Param('id') id: string,
    @Body() { status }: UpdateTaskStatusDto,
    @GetUser() user: User,
  ): Promise<Task> {
    if (!isUUID(id)) {
      throw new BadRequestException(
        `Invalid id, UUID format expected but received ${id}`,
      );
    }
    return this.tasksService.updateTaskStatusDto(id, status, user);
  }
}
