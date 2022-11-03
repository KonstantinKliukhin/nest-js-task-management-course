import { Injectable, NotFoundException } from '@nestjs/common';
import { TaskStatus } from './task-status.enum';
import { CreateTaskDto } from './dto/create-task.dto';
import { TasksRepository } from './tasks.repository';
import { Task } from './task.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { GetTasksFilterDto } from './dto/get-tasks-filter.dto';
import { User } from '../auth/user.entity';

@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(TasksRepository) private tasksRepository: TasksRepository,
  ) {}
  public async getTasks(
    filterDto: GetTasksFilterDto,
    user: User,
  ): Promise<Task[]> {
    return await this.tasksRepository.getTasks(filterDto, user);
  }
  public async createTask(
    { title, description }: CreateTaskDto,
    user: User,
  ): Promise<Task> {
    const task = this.tasksRepository.create({
      title,
      description,
      status: TaskStatus.OPEN,
      user,
    });

    await this.tasksRepository.save(task);
    return task;
  }

  public async getTaskById(id: string, user: User): Promise<Task> {
    const found = await this.tasksRepository.findOne({
      where: {
        id,
        user,
      },
    });

    if (!found) {
      throw new NotFoundException(`Task width ID ${id} not found`);
    }

    return found;
  }

  public async deleteTask(id: string, user: User): Promise<void> {
    const { affected } = await this.tasksRepository.delete({ id, user });

    if (!affected) {
      throw new NotFoundException(`Task width ID ${id} not found`);
    }
  }

  public async updateTaskStatusDto(
    id: string,
    status: TaskStatus,
    user: User,
  ): Promise<Task> {
    const task = await this.getTaskById(id, user);

    task.status = status;

    await this.tasksRepository.save(task);

    return task;
  }
}
