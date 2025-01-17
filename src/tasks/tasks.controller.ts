import { Controller, Get, Post, Body, Param, Delete, Patch, Query, UsePipes, ValidationPipe, ParseIntPipe, UseGuards, Logger } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { TaskStatusValidationPipe } from './pipes/task-status-validation.pipe';
import { GetTasksFilterDto } from './dto/get-tasks-filter.dto';
import { Task } from './task.entity';
import { TaskStatus } from './task-status.enum';
import { AuthGuard } from '@nestjs/passport';
import { User } from 'src/auth/user.entity';
import { GetUser } from 'src/auth/get-user-decorater';

@Controller('tasks')
@UseGuards(AuthGuard())
export class TasksController {

  private logger = new Logger('TasksController');

  constructor(private tasksService: TasksService) {}

  @Get()
  getTasks(@Query(ValidationPipe) filterDto: GetTasksFilterDto,@GetUser() user:User): Promise<Task[]> {
    this.logger.verbose(`User ${user.username} retriving all task.`)
    return this.tasksService.getTasks(filterDto,user);
  }

  @Get('/:id')
  getTaskById(@Param('id', ParseIntPipe) id: number,@GetUser() user:User): Promise<Task> {
    return this.tasksService.getTaskById(id,user);
  }

  @Post()
  @UsePipes(ValidationPipe)
  createTask(@Body() createTaskDto: CreateTaskDto,@GetUser() user:User): Promise<Task> {
    return this.tasksService.createTask(createTaskDto,user);
  }

  @Delete('/:id')
  deleteTask(@Param('id', ParseIntPipe) id: number,@GetUser() user:User): Promise<void> {
    return this.tasksService.deleteTask(id,user);
  }

  @Patch('/:id/status')
  updateTaskStatus(
    @Param('id', ParseIntPipe) id: number,
    @Body('status', TaskStatusValidationPipe) status: TaskStatus,@GetUser() user:User
  ): Promise<Task> {
    return this.tasksService.updateTaskStatus(id, status,user);
  }
}
