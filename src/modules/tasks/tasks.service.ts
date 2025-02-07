import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
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

  async createTask(createTaskDto: CreateTaskDto): Promise<Task> {
    try {
        console.log('2. Service receives:', createTaskDto);
        
        const { projectId, assigneeId, ...taskData } = createTaskDto;
        console.log('3. After destructuring:', { taskData, projectId, assigneeId });

        const project = await this.projectRepository.findOne({ where: { id: projectId } });
        console.log('Found project:', project);

        if (!project) {
            throw new NotFoundException(`Project with ID "${projectId}" not found`);
        }

        const assignee = await this.userRepository.findOne({ where: { id: assigneeId } });
        console.log('Found assignee:', assignee);

        if (!assignee) {
            throw new NotFoundException(`User with ID "${assigneeId}" not found`);
        }
        
        console.log('TaskData before create:', taskData);
        if (!taskData.title || !taskData.description) {
            throw new Error(`Missing required fields: ${!taskData.title ? 'title' : ''} ${!taskData.description ? 'description' : ''}`);
        }

        const newTask = this.taskRepository.create({
            title: taskData.title,
            description: taskData.description,
            project,
            assignee,
        });
        console.log('4. Before save:', newTask);

        const savedTask = await this.taskRepository.save(newTask);
        console.log('5. After save:', savedTask);

        return savedTask;
    } catch (error) {
        console.error('Error in createTask:', error);
        throw error;
    }
  }


  async getTaskById(id: string): Promise<Task> {
    const task = await this.taskRepository.findOne({
      where: { id },
      relations: ['assignee', 'project'],
    });

    if (!task) {
      throw new NotFoundException(`Task with ID "${id}" not found`);
    }

    return task;
  }

  async updateTask(id: string, updateTaskDto: UpdateTaskDto): Promise<Task> {
    console.log('Updating task with data:', updateTaskDto);
    const task = await this.getTaskById(id);
    console.log('Found task:', task);
    
    if (updateTaskDto.title) {
        task.title = updateTaskDto.title;
    }
    
    if (updateTaskDto.description) {
        task.description = updateTaskDto.description;
    }
    
    if (updateTaskDto.status) {
        task.status = updateTaskDto.status;
    }
    
    if (updateTaskDto.assigneeId) {
        const assignee = await this.userRepository.findOne({ 
            where: { id: updateTaskDto.assigneeId } 
        });
        if (!assignee) {
            throw new NotFoundException(`User with ID "${updateTaskDto.assigneeId}" not found`);
        }
        task.assignee = assignee;
    }

    const savedTask = await this.taskRepository.save(task);
    console.log('Saved task:', savedTask);
    return savedTask;
  }

  async deleteTask(id: string): Promise<void> {
    const result = await this.taskRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Task with ID "${id}" not found`);
    }
  }

  async assignTask(taskId: string, userId: string): Promise<Task> {
    const task = await this.taskRepository.findOne({
        where: { id: taskId },
        relations: ['assignee', 'project']
    });

    if (!task) {
        throw new NotFoundException(`Task with ID "${taskId}" not found`);
    }

    const user = await this.userRepository.findOne({
        where: { id: userId }
    });

    if (!user) {
        throw new NotFoundException(`User with ID "${userId}" not found`);
    }

    task.assignee = user;
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
