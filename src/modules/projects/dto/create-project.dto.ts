import { IsString, IsNotEmpty } from 'class-validator';
import { ApiProperty, ApiTags } from '@nestjs/swagger';

@ApiTags('Project DTOs')
export class CreateProjectDto {
    @ApiProperty({ 
        example: 'New Project', 
        description: 'Project name',
        title: 'Name',
        minLength: 1,
        maxLength: 100
    })
    @IsString()
    @IsNotEmpty()
    name: string;

    @ApiProperty({ 
        example: 'Project description text', 
        description: 'Project detailed description',
        title: 'Description',
        minLength: 1,
        maxLength: 500
    })
    @IsString()
    @IsNotEmpty()
    description: string;
}
