import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany } from 'typeorm';
import { ApiProperty, ApiTags } from '@nestjs/swagger';
import { Exclude } from 'class-transformer';
import { Project } from '../projects/project.entity';
import { Task } from '../tasks/task.entity';

export enum UserRole {
  ADMIN = 'admin',
  EMPLOYEE = 'employee',
}

@ApiTags('Users')
@Entity('users')
export class User {
  @ApiProperty({ 
    example: '8894fd71-207a-4fb7-9bd9-9f5decd66857', 
    description: 'Unique user ID',
    title: 'User Identifier'
  })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({ 
    example: 'admin@example.com', 
    description: 'User email address',
    title: 'Email'
  })
  @Column({ unique: true })
  email: string;

  @Exclude()
  @Column()
  password: string;

  @ApiProperty({ 
    example: 'Admin User', 
    description: 'User full name',
    title: 'Full Name'
  })
  @Column()
  name: string;

  @ApiProperty({ 
    enum: UserRole, 
    example: UserRole.ADMIN, 
    description: 'User role (admin or employee)',
    title: 'Role'
  })
  @Column({
    type: 'enum',
    enum: UserRole,
    default: UserRole.EMPLOYEE
  })
  role: UserRole;

  @ApiProperty({ 
    example: '2025-02-06T10:04:23.848Z', 
    description: 'User creation timestamp',
    title: 'Created At'
  })
  @CreateDateColumn()
  createdAt: Date;

  @ApiProperty({ 
    example: '2025-02-06T10:04:23.848Z', 
    description: 'User last update timestamp',
    title: 'Updated At'
  })
  @UpdateDateColumn()
  updatedAt: Date;

  @ApiProperty({ 
    type: () => [Project], 
    description: 'Projects owned by user',
    title: 'Projects'
  })
  @OneToMany(() => Project, project => project.owner, {
    cascade: true,
  })
  projects: Project[];

  @ApiProperty({ 
    type: () => [Task], 
    description: 'Tasks assigned to user',
    title: 'Tasks'
  })
  @OneToMany(() => Task, task => task.assignees)
  tasks: Task[];
}
