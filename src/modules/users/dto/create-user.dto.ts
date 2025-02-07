import { IsEmail, IsString, MinLength, IsEnum } from 'class-validator';
import { ApiProperty, ApiTags } from '@nestjs/swagger';
import { UserRole } from '../user.entity';

@ApiTags('User DTOs')
export class CreateUserDto {
    @ApiProperty({ 
        example: 'user@example.com', 
        description: 'User email address',
        title: 'Email',
        format: 'email',
        uniqueItems: true
    })
    @IsEmail()
    email: string;

    @ApiProperty({ 
        example: 'password123', 
        description: 'User password (min 6 characters)',
        title: 'Password',
        minLength: 6,
        format: 'password'
    })
    @IsString()
    @MinLength(6)
    password: string;

    @ApiProperty({ 
        example: 'John Doe', 
        description: 'User full name',
        title: 'Full Name',
        minLength: 2
    })
    @IsString()
    name: string;

    @ApiProperty({ 
        enum: UserRole, 
        example: UserRole.EMPLOYEE, 
        description: 'User role (admin or employee)',
        title: 'Role',
        default: UserRole.EMPLOYEE
    })
    @IsEnum(UserRole)
    role: UserRole;
}
