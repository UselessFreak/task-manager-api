import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards, HttpCode, ClassSerializerInterceptor, UseInterceptors } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { ProjectsService } from './projects.service';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { GetUser } from '../auth/get-user.decorator';
import { User } from '../users/user.entity';
import { Project } from './project.entity';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { UserRole } from '../users/user.entity';

@ApiTags('Projects')
@ApiBearerAuth()
@Controller('projects')
@UseInterceptors(ClassSerializerInterceptor)
@UseGuards(JwtAuthGuard, RolesGuard)
export class ProjectsController {
    constructor(private readonly projectsService: ProjectsService) {}

    @Post()
    @Roles(UserRole.ADMIN)
    @ApiOperation({ summary: 'Create new project' })
    @ApiResponse({ status: 201, description: 'Project successfully created', type: Project })
    @ApiResponse({ status: 401, description: 'Unauthorized' })
    @ApiResponse({ status: 403, description: 'Forbidden - Admin only' })
    async createProject(
        @Body() createProjectDto: CreateProjectDto, 
        @GetUser() user: User
    ): Promise<Project> {
        return this.projectsService.createProject(createProjectDto, user);
    }

    @Get(':id')
    @Roles(UserRole.ADMIN, UserRole.EMPLOYEE)
    @ApiOperation({ summary: 'Get project by ID' })
    @ApiResponse({ status: 200, description: 'Returns project details', type: Project })
    @ApiResponse({ status: 404, description: 'Project not found' })
    async getProjectById(@Param('id') id: string): Promise<Project> {
        return this.projectsService.getProjectById(id);
    }

    @Put('/:id')
    @Roles(UserRole.ADMIN)
    @ApiOperation({ summary: 'Update project' })
    @ApiResponse({ status: 200, description: 'Project successfully updated', type: Project })
    @ApiResponse({ status: 403, description: 'Forbidden - Admin only' })
    @ApiResponse({ status: 404, description: 'Project not found' })
    async updateProject(
        @Param('id') id: string,
        @Body() updateProjectDto: UpdateProjectDto,
    ): Promise<Project> {
        return this.projectsService.updateProject(id, updateProjectDto);
    }

    @Delete('/:id')
    @Roles(UserRole.ADMIN)
    @ApiOperation({ summary: 'Delete project' })
    @ApiResponse({ status: 204, description: 'Project successfully deleted' })
    @ApiResponse({ status: 403, description: 'Forbidden - Admin only' })
    @ApiResponse({ status: 404, description: 'Project not found' })
    @HttpCode(204)
    async deleteProject(@Param('id') id: string): Promise<void> {
        return this.projectsService.deleteProject(id);
    }
}
