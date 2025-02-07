import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn, UpdateDateColumn, JoinColumn, OneToMany } from 'typeorm';
import { ApiProperty, ApiTags } from '@nestjs/swagger';
import { User } from '../users/user.entity';
import { Task } from '../tasks/task.entity';

@ApiTags('Projects')
@Entity('projects')
export class Project {
  @ApiProperty({ 
    example: '620bc699-9938-4e24-b277-b288d5600308', 
    description: 'Unique project ID',
    title: 'Project Identifier'
  })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({ 
    example: 'Task Testing Project', 
    description: 'Project name',
    title: 'Name'
  })
  @Column()
  name: string;

  @ApiProperty({ 
    example: 'Project for testing tasks API', 
    description: 'Project description',
    title: 'Description'
  })
  @Column()
  description: string;

  @ApiProperty({ 
    example: '8894fd71-207a-4fb7-9bd9-9f5decd66857', 
    description: 'Project owner ID',
    title: 'Owner ID'
  })
  @Column({ nullable: true })
  ownerId: string;

  @ApiProperty({ 
    type: () => User, 
    description: 'Project owner details',
    title: 'Owner'
  })
  @ManyToOne(() => User, user => user.projects, { 
    onDelete: 'CASCADE' 
  })
  @JoinColumn({ name: 'ownerId' })
  owner: User;

  @ApiProperty({ 
    example: '2025-02-07T04:46:11.938Z', 
    description: 'Project creation timestamp',
    title: 'Created At'
  })
  @CreateDateColumn()
  createdAt: Date;

  @ApiProperty({ 
    example: '2025-02-07T04:46:11.938Z', 
    description: 'Project last update timestamp',
    title: 'Updated At'
  })
  @UpdateDateColumn()
  updatedAt: Date;

  @ApiProperty({ 
    type: () => [Task], 
    description: 'Tasks in the project',
    title: 'Tasks'
  })
  @OneToMany(() => Task, task => task.project)
  tasks: Task[];
}
