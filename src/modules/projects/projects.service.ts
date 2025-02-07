import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Project } from './project.entity';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { User } from '../users/user.entity';
import { instanceToPlain } from 'class-transformer';

@Injectable()
export class ProjectsService {
  constructor(
    @InjectRepository(Project)
    private projectsRepository: Repository<Project>,
  ) {}

  async createProject(createProjectDto: CreateProjectDto, user: User): Promise<Project> {
    const project = this.projectsRepository.create({
      ...createProjectDto,
      ownerId: user.id,
      owner: user
    });
    return this.projectsRepository.save(project);
  }

  async getAllProjects(): Promise<Project[]> {
    const projects = await this.projectsRepository
      .createQueryBuilder('project')
      .leftJoinAndSelect('project.owner', 'owner')
      .getMany();
    
    return instanceToPlain(projects) as Project[];
  }

  async getProjectById(id: string): Promise<Project> {
    const project = await this.projectsRepository
      .createQueryBuilder('project')
      .leftJoinAndSelect('project.owner', 'owner')
      .where('project.id = :id', { id })
      .getOne();
    
    if (!project) {
      throw new NotFoundException(`Project with ID "${id}" not found`);
    }
    
    return instanceToPlain(project) as Project;
  }
  
  async updateProject(id: string, updateProjectDto: UpdateProjectDto): Promise<Project> {
    const project = await this.projectsRepository.findOne({ 
      where: { id },
      relations: ['owner']
    });
    
    if (!project) {
      throw new NotFoundException(`Project with ID "${id}" not found`);
    }
    
    Object.assign(project, updateProjectDto);
    
    const updatedProject = await this.projectsRepository.save(project);
    return instanceToPlain(updatedProject) as Project;
  }

  async deleteProject(id: string): Promise<void> {
    const result = await this.projectsRepository.delete(id);
    
    if (result.affected === 0) {
      throw new NotFoundException(`Project with ID "${id}" not found`);
    }
  }
}
