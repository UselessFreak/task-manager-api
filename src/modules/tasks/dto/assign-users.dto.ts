import { IsArray, IsUUID } from 'class-validator';
import { ApiProperty, ApiTags } from '@nestjs/swagger';

@ApiTags('Task DTOs')
export class AssignUsersDto {
    @ApiProperty({ 
        example: ['8894fd71-207a-4fb7-9bd9-9f5decd66857'], 
        description: 'Array of user IDs to assign to task',
        title: 'User Identifiers',
        type: [String],
        format: 'uuid',
        isArray: true
    })
    @IsArray()
    @IsUUID('4', { each: true })
    userIds: string[];
}
