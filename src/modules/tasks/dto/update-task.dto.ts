import { IsOptional, IsString, IsEnum, IsUUID, IsArray } from 'class-validator';
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
        example: ['8894fd71-207a-4fb7-9bd9-9f5decd66857'], 
        description: 'Array of new assignee user IDs',
        title: 'Assignee Identifiers',
        required: false,
        type: [String],
        format: 'uuid',
        isArray: true
    })
    @IsOptional()
    @IsArray()
    @IsUUID('4', { each: true })
    assigneeIds?: string[];
}
