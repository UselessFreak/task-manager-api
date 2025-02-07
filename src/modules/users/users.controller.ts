import { Controller, Post, Body, Get, Param, Put, Delete, UseInterceptors, ClassSerializerInterceptor } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@ApiTags('users')
@UseInterceptors(ClassSerializerInterceptor)
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  @ApiOperation({ summary: 'Create new user' })
  async createUser(@Body() createUserDto: CreateUserDto) {
    return this.usersService.createUser(
      createUserDto.email,
      createUserDto.password,
      createUserDto.name,
      createUserDto.role
    );
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get user by ID' })
  async findOne(@Param('id') id: string) {
    return this.usersService.findById(id);
  }

  @Get()
  @ApiOperation({ summary: 'Get all users' })
  async findAll() {
    return this.usersService.findAll();
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update user' })
  async updateUser(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    return this.usersService.updateUser(id, updateUserDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete user' })
  async deleteUser(@Param('id') id: string) {
    return this.usersService.deleteUser(id);
  }

  @Post(':id/projects/:projectId')
  @ApiOperation({ summary: 'Add user to project' })
  async addUserToProject(
    @Param('id') userId: string,
    @Param('projectId') projectId: string,
  ) {
    return this.usersService.addUserToProject(userId, projectId);
  }

  @Delete(':id/projects/:projectId')
  @ApiOperation({ summary: 'Remove user from project' })
  async removeUserFromProject(
    @Param('id') userId: string,
    @Param('projectId') projectId: string,
  ) {
    return this.usersService.removeUserFromProject(userId, projectId);
  }
}
