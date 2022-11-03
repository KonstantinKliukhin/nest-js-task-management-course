import { Repository } from 'typeorm';
import { Task } from './task.entity';
import { CustomRepository } from '../database/typeorm-ex.decorator';
import { GetTasksFilterDto } from './dto/get-tasks-filter.dto';
import { User } from '../auth/user.entity';

@CustomRepository(Task)
export class TasksRepository extends Repository<Task> {
  async getTasks(
    { status, search }: GetTasksFilterDto,
    user: User,
  ): Promise<Task[]> {
    const query = this.createQueryBuilder('task');

    query.where({ user });
    if (status) {
      query.andWhere('task.status = :status', { status });
    }

    if (search) {
      query.andWhere(
        '(LOWER(task.title) LIKE LOWER(:search) OR LOWER(task.description) LIKE LOWER(:search))',
        { search: `%${search}%` },
      );
    }

    return await query.getMany();
  }
}
