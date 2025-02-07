import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, UpdateDateColumn } from 'typeorm';
import { User } from './user.entity';
import { UpdateUserDto } from './dto/update-user.dto';
import { Project } from '../projects/project.entity';
import { UserRole } from './user.entity';
import * as bcrypt from 'bcrypt';


@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    @InjectRepository(Project)
    private projectRepository: Repository<Project>
  ) {}

  async createUser(email: string, password: string, name: string, role: UserRole): Promise<User> {
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = this.usersRepository.create({
        email,
        password: hashedPassword,
        name,
        role: role || UserRole.EMPLOYEE
    });
    return this.usersRepository.save(user);
  }


  async findByEmail(email: string): Promise<User | null> {
    return this.usersRepository.findOne({ where: { email } });
  }

  async findById(id: string): Promise<User | null> {
    return this.usersRepository.findOne({ 
        where: { id },
        relations: ['projects']
    });
  }

  async findAll(): Promise<User[]> {
    return this.usersRepository.find();
  }

  async updateUser(id: string, updateUserDto: UpdateUserDto): Promise<User> {
    const user = await this.findById(id);
    if (!user) {
      throw new NotFoundException(`User with ID "${id}" not found`);
    }

    if (updateUserDto.password) {
      updateUserDto.password = await bcrypt.hash(updateUserDto.password, 10);
    }

    Object.assign(user, updateUserDto);
    return this.usersRepository.save(user);
  }

  async deleteUser(id: string): Promise<void> {
    const user = await this.findById(id);
    if (!user) {
        throw new NotFoundException(`User with ID "${id}" not found`);
    }
    
    const userWithRelations = await this.usersRepository.findOne({
        where: { id },
        relations: ['projects', 'tasks']
    });

    if (userWithRelations) {
        userWithRelations.projects = [];
        userWithRelations.tasks = [];
        await this.usersRepository.save(userWithRelations);
    }
    
    const result = await this.usersRepository.delete(id);
    if (result.affected === 0) {
        throw new NotFoundException(`User with ID "${id}" not found`);
    }
  }

  async addUserToProject(userId: string, projectId: string): Promise<User> {
    const user = await this.findById(userId);
    const project = await this.projectRepository.findOne({ where: { id: projectId } });

    if (!user || !project) {
      throw new NotFoundException('User or Project not found');
    }

    if (!user.projects) {
      user.projects = [];
    }
    user.projects.push(project);
    return this.usersRepository.save(user);
  }

  async removeUserFromProject(userId: string, projectId: string): Promise<User> {
    const user = await this.findById(userId);
    if (!user) {
      throw new NotFoundException(`User with ID "${userId}" not found`);
    }

    user.projects = user.projects.filter(project => project.id !== projectId);
    return this.usersRepository.save(user);
  }
}
