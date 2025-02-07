import { IsEmail, IsString, MinLength, IsEnum } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { UserRole } from '../roles.decorator';

export class AuthCredentialsDto {
    @ApiProperty({ example: 'user@example.com', description: 'User email address' })
    @IsEmail()
    email: string;

    @ApiProperty({ example: 'password123', description: 'User password', minimum: 6 })
    @IsString()
    @MinLength(6)
    password: string;

    @ApiProperty({ example: 'John Doe', description: 'User full name' })
    @IsString()
    name: string;

    @ApiProperty({ enum: UserRole, example: UserRole.EMPLOYEE, description: 'User role' })
    @IsEnum(UserRole)
    role: UserRole;
}
