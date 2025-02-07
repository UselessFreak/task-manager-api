import { IsString, IsOptional } from 'class-validator';
import { ApiProperty, ApiTags } from '@nestjs/swagger';

@ApiTags('Project DTOs')
export class UpdateProjectDto {
    @ApiProperty({ 
        example: 'Updated Project Name', 
        description: 'New project name',
        title: 'Name',
        required: false,
        minLength: 1,
        maxLength: 100
    })
    @IsOptional()
    @IsString()
    name?: string;

    @ApiProperty({ 
        example: 'Updated project description', 
        description: 'New project description',
        title: 'Description',
        required: false,
        minLength: 1,
        maxLength: 500
    })
    @IsOptional()
    @IsString()
    description?: string;
}
