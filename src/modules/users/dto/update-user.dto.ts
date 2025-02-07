import { IsOptional, IsString, IsEmail, IsEnum } from 'class-validator';
import { ApiProperty, ApiTags } from '@nestjs/swagger';
import { UserRole } from '../user.entity';

@ApiTags('User DTOs')
export class UpdateUserDto {
    @ApiProperty({ 
        example: 'updated@example.com', 
        description: 'New email address',
        title: 'Email',
        format: 'email',
        required: false,
        uniqueItems: true
    })
    @IsOptional()
    @IsEmail()
    email?: string;

    @ApiProperty({ 
        example: 'newpassword123', 
        description: 'New password',
        title: 'Password',
        format: 'password',
        required: false,
        minLength: 6
    })
    @IsOptional()
    @IsString()
    password?: string;

    @ApiProperty({ 
        example: 'Updated Name', 
        description: 'New user name',
        title: 'Full Name',
        required: false,
        minLength: 2
    })
    @IsOptional()
    @IsString()
    name?: string;

    @ApiProperty({ 
        enum: UserRole, 
        example: UserRole.ADMIN, 
        description: 'New user role (admin or employee)',
        title: 'Role',
        required: false
    })
    @IsOptional()
    @IsEnum(UserRole)
    role?: UserRole;
}
