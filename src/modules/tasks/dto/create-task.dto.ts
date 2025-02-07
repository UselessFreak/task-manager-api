import { IsNotEmpty, IsString, IsUUID, IsArray } from 'class-validator';
import { ApiProperty, ApiTags } from '@nestjs/swagger';

@ApiTags('Task DTOs')
export class CreateTaskDto {
    @ApiProperty({ 
        example: 'Implement login feature', 
        description: 'Task title',
        title: 'Title',
        minLength: 3,
        maxLength: 100
    })
    @IsNotEmpty()
    @IsString()
    title: string;

    @ApiProperty({ 
        example: 'Create login form and API integration', 
        description: 'Task description',
        title: 'Description',
        minLength: 10,
        maxLength: 1000
    })
    @IsNotEmpty()
    @IsString()
    description: string;

    @ApiProperty({ 
        example: '49248fda-adcf-47aa-8ea6-980ffe5b77a7', 
        description: 'Project ID',
        title: 'Project Identifier',
        format: 'uuid'
    })
    @IsNotEmpty()
    @IsUUID()
    projectId: string;

    @ApiProperty({ 
        example: ['8894fd71-207a-4fb7-9bd9-9f5decd66857'], 
        description: 'Array of assignee user IDs',
        title: 'Assignee Identifiers',
        type: [String],
        format: 'uuid',
        isArray: true
    })
    @IsArray()
    @IsUUID('4', { each: true })
    assigneeIds: string[];
}
