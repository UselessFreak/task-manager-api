import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { Task } from './task.entity';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { User } from '../users/user.entity';
import { Project } from '../projects/project.entity';
import { TaskStatus } from './task-status.enum';

@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(Task)
    private taskRepository: Repository<Task>,
    @InjectRepository(Project)
    private projectRepository: Repository<Project>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async createTask(createTaskDto: CreateTaskDto, creator: User): Promise<Task> {
    try {
      const { projectId, assigneeIds, ...taskData } = createTaskDto;

      const project = await this.projectRepository.findOne({ where: { id: projectId } });
      if (!project) {
        throw new NotFoundException(`Project with ID "${projectId}" not found`);
      }

      // Добавляем создателя в список исполнителей, если его там нет
      const uniqueAssigneeIds = Array.from(new Set([...assigneeIds, creator.id]));
      
      const assignees = await this.userRepository.find({ 
        where: { id: In(uniqueAssigneeIds) }
      });
      if (assignees.length !== uniqueAssigneeIds.length) {
        throw new NotFoundException('One or more assignees not found');
      }

      if (!taskData.title || !taskData.description) {
        throw new Error(`Missing required fields: ${!taskData.title ? 'title' : ''} ${!taskData.description ? 'description' : ''}`);
      }

      const newTask = this.taskRepository.create({
        title: taskData.title,
        description: taskData.description,
        project,
        assignees,
        isArchived: false
      });

      return await this.taskRepository.save(newTask);
    } catch (error) {
      console.error('Error in createTask:', error);
      throw error;
    }
  }

  async getTasks(): Promise<Task[]> {
    return this.taskRepository.find({
      where: { isArchived: false },
      relations: ['assignees', 'project'],
    });
  }

  async getTaskById(id: string): Promise<Task> {
    const task = await this.taskRepository.findOne({
      where: { id },
      relations: ['assignees', 'project'],
    });

    if (!task) {
      throw new NotFoundException(`Task with ID "${id}" not found`);
    }

    return task;
  }

  async updateTask(id: string, updateTaskDto: UpdateTaskDto): Promise<Task> {
    const task = await this.getTaskById(id);
    
    if (updateTaskDto.title) {
        task.title = updateTaskDto.title;
    }
    
    if (updateTaskDto.description) {
        task.description = updateTaskDto.description;
    }
    
    if (updateTaskDto.status) {
        task.status = updateTaskDto.status;
    }
    
    if (updateTaskDto.assigneeIds) {
        const assignees = await this.userRepository.find({ 
            where: { id: In(updateTaskDto.assigneeIds) }
        });
        if (assignees.length !== updateTaskDto.assigneeIds.length) {
            throw new NotFoundException('One or more assignees not found');
        }
        task.assignees = assignees;
    }

    return await this.taskRepository.save(task);
  }

  async archiveTask(id: string): Promise<Task> {
    const task = await this.getTaskById(id);
    task.isArchived = true;
    return await this.taskRepository.save(task);
  }

  async assignUsers(taskId: string, userIds: string[]): Promise<Task> {
    const task = await this.taskRepository.findOne({
        where: { id: taskId },
        relations: ['assignees']
    });

    if (!task) {
        throw new NotFoundException(`Task with ID "${taskId}" not found`);
    }

    const users = await this.userRepository.findByIds(userIds);
    if (users.length !== userIds.length) {
        throw new NotFoundException('One or more users not found');
    }

    task.assignees = users;
    return this.taskRepository.save(task);
  }

  async removeAssignee(taskId: string, userId: string): Promise<Task> {
    const task = await this.taskRepository.findOne({
        where: { id: taskId },
        relations: ['assignees']
    });

    if (!task) {
        throw new NotFoundException(`Task with ID "${taskId}" not found`);
    }

    task.assignees = task.assignees.filter(user => user.id !== userId);
    return this.taskRepository.save(task);
  }

  async updateTaskStatus(taskId: string, status: TaskStatus): Promise<Task> {
    const task = await this.getTaskById(taskId);
    task.status = status;
    return this.taskRepository.save(task);
  }

  async moveTaskToProject(taskId: string, projectId: string): Promise<Task> {
    const task = await this.getTaskById(taskId);
    
    const newProject = await this.projectRepository.findOne({
        where: { id: projectId }
    });

    if (!newProject) {
        throw new NotFoundException(`Project with ID "${projectId}" not found`);
    }

    task.project = newProject;
    return this.taskRepository.save(task);
  }
}
