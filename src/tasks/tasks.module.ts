import { Module } from '@nestjs/common';
import { TasksController } from './tasks.controller';
import { TasksService } from './tasks.service';
import { TasksRepository } from './tasks.repository';
import { TypeOrmExModule } from '../database/typeorm-ex.module';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [TypeOrmExModule.forCustomRepository([TasksRepository]), AuthModule],
  controllers: [TasksController],
  providers: [TasksService],
  exports: [TasksService],
})
export class TasksModule {}
