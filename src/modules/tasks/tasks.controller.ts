import { Controller, Get, Post, Put, Delete, Patch, Body, Param, UseGuards, HttpCode, ClassSerializerInterceptor, UseInterceptors } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { TasksService } from './tasks.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Task } from './task.entity';
import { TaskStatus } from './task-status.enum';
import { Roles, UserRole } from '../auth/roles.decorator';
import { RolesGuard } from '../auth/roles.guard';

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
  async createTask(@Body() createTaskDto: CreateTaskDto): Promise<Task> {
    return this.tasksService.createTask(createTaskDto);
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

  @Delete('/:id')
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Delete task' })
  @ApiResponse({ status: 204, description: 'Task successfully deleted' })
  @ApiResponse({ status: 403, description: 'Forbidden - Admin only' })
  @HttpCode(204)
  async deleteTask(@Param('id') id: string): Promise<void> {
    return this.tasksService.deleteTask(id);
  }

  @Patch(':taskId/assignee/:userId')
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Assign task to user' })
  @ApiResponse({ status: 200, description: 'Task successfully assigned', type: Task })
  @ApiResponse({ status: 403, description: 'Forbidden - Admin only' })
  async assignTask(
    @Param('taskId') taskId: string,
    @Param('userId') userId: string,
  ): Promise<Task> {
    return this.tasksService.assignTask(taskId, userId);
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
