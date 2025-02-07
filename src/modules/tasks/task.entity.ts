import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { ApiProperty, ApiTags } from '@nestjs/swagger';
import { User } from '../users/user.entity';
import { Project } from '../projects/project.entity';
import { TaskStatus } from './task-status.enum';

@ApiTags('Tasks')
@Entity('tasks')
export class Task {
  @ApiProperty({ 
    example: '93e33a45-2b5d-41e7-9801-1646f3573089', 
    description: 'Unique task ID',
    title: 'Task Identifier'
  })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({ 
    example: 'Implement Login Feature', 
    description: 'Task title',
    title: 'Title'
  })
  @Column({ nullable: false, type: 'varchar' })
  title: string;

  @ApiProperty({ 
    example: 'Create login form and integrate with API', 
    description: 'Task description',
    title: 'Description'
  })
  @Column({ nullable: false, type: 'text' })
  description: string;

  @ApiProperty({ 
    enum: TaskStatus, 
    example: TaskStatus.TODO, 
    description: 'Current task status',
    title: 'Status'
  })
  @Column({
    type: 'enum',
    enum: TaskStatus,
    default: TaskStatus.TODO
  })
  status: TaskStatus;

  @ApiProperty({ 
    type: () => User, 
    description: 'Task assignee details',
    title: 'Assignee'
  })
  @ManyToOne(() => User, user => user.tasks)
  assignee: User;

  @ApiProperty({ 
    type: () => Project, 
    description: 'Project the task belongs to',
    title: 'Project'
  })
  @ManyToOne(() => Project, project => project.tasks)
  project: Project;

  @ApiProperty({ 
    example: '2025-02-07T04:46:43.450Z', 
    description: 'Task creation timestamp',
    title: 'Created At'
  })
  @CreateDateColumn()
  createdAt: Date;

  @ApiProperty({ 
    example: '2025-02-07T04:46:43.450Z', 
    description: 'Task last update timestamp',
    title: 'Updated At'
  })
  @UpdateDateColumn()
  updatedAt: Date;
}
