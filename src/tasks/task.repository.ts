import { Task } from './task.entity';
import { EntityRepository, Repository } from 'typeorm';
import { CreateTaskDto } from './dto/create-task.dto';
import { TaskStatus } from './task-status.enum';
import { GetTasksFilterDto } from './dto/get-tasks-filter.dto';
import { User } from 'src/auth/user.entity';
import { Logger, InternalServerErrorException } from '@nestjs/common';

@EntityRepository(Task)
export class TaskRepository extends Repository<Task> {

  private logger  = new Logger('TaskRepository');
  async getTasks(filterDto: GetTasksFilterDto,user:User): Promise<Task[]> {
    const { status, search } = filterDto;
    const query = this.createQueryBuilder('task');

    query.where('task.userId = :userId',{userId : user.id});

    if (status) {
      query.andWhere('task.status = :status', { status });
    }

    if (search) {
      query.andWhere('(task.title LIKE :search OR task.description LIKE :search)', { search: `%${search}%` });
    }

    try{
      const tasks = await query.getMany();
    return tasks;
    }catch(error){
      this.logger.error(`Failed To get task for user ${user.username}`,error.stack);
      throw new InternalServerErrorException();
    }

    
  }

  async createTask(createTaskDto: CreateTaskDto,user:User): Promise<Task> {
    const { title, description } = createTaskDto;

    const task = new Task();
    task.title = title;
    task.description = description;
    task.status = TaskStatus.OPEN;
    task.user =user;
    await task.save();

    delete task.user;
    return task;
  }
}
