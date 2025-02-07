import { Controller, Get, Post, Put, Delete, Patch, Body, Param, UseGuards, HttpCode, ClassSerializerInterceptor, UseInterceptors } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { TasksService } from './tasks.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { AssignUsersDto } from './dto/assign-users.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Task } from './task.entity';
import { TaskStatus } from './task-status.enum';
import { Roles, UserRole } from '../auth/roles.decorator';
import { RolesGuard } from '../auth/roles.guard';
import { GetUser } from '../auth/get-user.decorator';
import { User } from '../users/user.entity';

@ApiTags('Tasks')
@ApiBearerAuth()
@Controller('tasks')
@UseInterceptors(ClassSerializerInterceptor)
@UseGuards(JwtAuthGuard, RolesGuard)
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @Post()
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Create new task' })
  @ApiResponse({ status: 201, description: 'Task successfully created', type: Task })
  @ApiResponse({ status: 403, description: 'Forbidden - Admin only' })
  async createTask(
    @Body() createTaskDto: CreateTaskDto,
    @GetUser() user: User
  ): Promise<Task> {
    return this.tasksService.createTask(createTaskDto, user);
  }

  @Get()
  @Roles(UserRole.ADMIN, UserRole.EMPLOYEE)
  @ApiOperation({ summary: 'Get all active tasks' })
  @ApiResponse({ status: 200, description: 'Returns all active tasks', type: [Task] })
  async getTasks(): Promise<Task[]> {
    return this.tasksService.getTasks();
  }

  @Get(':id')
  @Roles(UserRole.ADMIN, UserRole.EMPLOYEE)
  @ApiOperation({ summary: 'Get task by ID' })
  @ApiResponse({ status: 200, description: 'Returns task details', type: Task })
  @ApiResponse({ status: 404, description: 'Task not found' })
  async getTaskById(@Param('id') id: string): Promise<Task> {
    return this.tasksService.getTaskById(id);
  }

  @Put('/:id')
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Update task' })
  @ApiResponse({ status: 200, description: 'Task successfully updated', type: Task })
  @ApiResponse({ status: 403, description: 'Forbidden - Admin only' })
  async updateTask(
    @Param('id') id: string,
    @Body() updateTaskDto: UpdateTaskDto,
  ): Promise<Task> {
    return this.tasksService.updateTask(id, updateTaskDto);
  }

  @Patch('/:id/archive')
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Archive task' })
  @ApiResponse({ status: 200, description: 'Task successfully archived', type: Task })
  @ApiResponse({ status: 403, description: 'Forbidden - Admin only' })
  async archiveTask(@Param('id') id: string): Promise<Task> {
    return this.tasksService.archiveTask(id);
  }

  @Patch(':taskId/assignees')
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Assign multiple users to task' })
  @ApiResponse({ status: 200, description: 'Users successfully assigned to task', type: Task })
  @ApiResponse({ status: 403, description: 'Forbidden - Admin only' })
  async assignUsers(
    @Param('taskId') taskId: string,
    @Body() assignUsersDto: AssignUsersDto
  ): Promise<Task> {
    return this.tasksService.assignUsers(taskId, assignUsersDto.userIds);
  }

  @Delete(':taskId/assignees/:userId')
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Remove assignee from task' })
  @ApiResponse({ status: 200, description: 'Assignee removed from task', type: Task })
  @ApiResponse({ status: 403, description: 'Forbidden - Admin only' })
  async removeAssignee(
    @Param('taskId') taskId: string,
    @Param('userId') userId: string
  ): Promise<Task> {
    return this.tasksService.removeAssignee(taskId, userId);
  }

  @Patch(':taskId/status/:status')
  @Roles(UserRole.ADMIN, UserRole.EMPLOYEE)
  @ApiOperation({ summary: 'Update task status' })
  @ApiResponse({ status: 200, description: 'Task status updated', type: Task })
  async updateTaskStatus(
    @Param('taskId') taskId: string,
    @Param('status') status: TaskStatus
  ): Promise<Task> {
    return this.tasksService.updateTaskStatus(taskId, status);
  }

  @Patch(':taskId/project/:projectId')
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Move task to another project' })
  @ApiResponse({ status: 200, description: 'Task moved to project', type: Task })
  @ApiResponse({ status: 403, description: 'Forbidden - Admin only' })
  async moveTaskToProject(
    @Param('taskId') taskId: string,
    @Param('projectId') projectId: string
  ): Promise<Task> {
    return this.tasksService.moveTaskToProject(taskId, projectId);
  }
}
