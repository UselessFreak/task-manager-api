import { IsOptional, IsString, IsEnum, IsUUID } from 'class-validator';
import { ApiProperty, ApiTags } from '@nestjs/swagger';
import { TaskStatus } from '../task-status.enum';

@ApiTags('Task DTOs')
export class UpdateTaskDto {
    @ApiProperty({ 
        example: 'Updated task title', 
        description: 'New task title',
        title: 'Title',
        required: false,
        minLength: 3,
        maxLength: 100
    })
    @IsOptional()
    @IsString()
    title?: string;

    @ApiProperty({ 
        example: 'Updated task description', 
        description: 'New task description',
        title: 'Description',
        required: false,
        minLength: 10,
        maxLength: 1000
    })
    @IsOptional()
    @IsString()
    description?: string;

    @ApiProperty({ 
        enum: TaskStatus, 
        example: TaskStatus.IN_PROGRESS, 
        description: 'Task status',
        title: 'Status',
        required: false
    })
    @IsOptional()
    @IsEnum(TaskStatus)
    status?: TaskStatus;

    @ApiProperty({ 
        example: '8894fd71-207a-4fb7-9bd9-9f5decd66857', 
        description: 'New assignee user ID',
        title: 'Assignee Identifier',
        required: false,
        format: 'uuid'
    })
    @IsOptional()
    @IsUUID()
    assigneeId?: string;
}
