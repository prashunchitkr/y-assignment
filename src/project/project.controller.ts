import { ApiSearchDecorator } from '@/utils/decorators/api-search-query.decorator';
import { ZodParseBoolPipe, ZodParseIntPipe } from '@/utils/zod';
import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  NotFoundException,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import {
  ApiCreatedResponse,
  ApiNoContentResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import { ProjectDto, ProjectPreviewDto } from './dto';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { IProjectService } from './project.service.abstract';

@Controller('project')
@ApiTags('Project')
export class ProjectController {
  constructor(private readonly projectService: IProjectService) {}

  @Post()
  @ApiOperation({ summary: 'Create a project' })
  @ApiCreatedResponse({
    description: 'The project has been successfully created.',
    type: ProjectDto,
  })
  async create(
    @Body() createProjectDto: CreateProjectDto,
  ): Promise<ProjectDto> {
    if (!createProjectDto.university && !createProjectDto.company)
      throw new BadRequestException(
        'You must provide a university or a company',
      );
    return await this.projectService.create(createProjectDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all projects with pagination and search.' })
  @ApiSearchDecorator()
  @ApiQuery({
    name: 'company',
    description: 'Include company',
    type: Boolean,
    required: false,
  })
  @ApiQuery({
    name: 'university',
    description: 'Include university',
    type: Boolean,
    required: false,
  })
  @ApiOkResponse({
    description: 'All projects',
    type: [ProjectPreviewDto],
  })
  findAll(
    @Query('skip', new ZodParseIntPipe({ default: 0 })) skip: number,
    @Query('take', new ZodParseIntPipe({ default: 10 })) take: number,
    @Query('company', new ZodParseBoolPipe()) company?: boolean,
    @Query('university', new ZodParseBoolPipe()) university?: boolean,
    @Query('name') name?: string,
    @Query('description') description?: string,
  ): Promise<ProjectPreviewDto[]> {
    return this.projectService.findAll({
      skip,
      take,
      name,
      description,
      includeCompany: company,
      includeUniversity: university,
    });
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a project by id' })
  @ApiParam({
    name: 'id',
    description: 'Project id',
    type: String,
    required: true,
  })
  @ApiOkResponse({
    description: 'The project',
    type: ProjectDto,
  })
  @ApiNotFoundResponse({
    description: 'The record does not exist',
  })
  async findOne(@Param('id') id: string): Promise<ProjectDto> {
    const project = await this.projectService.findOne(id);

    if (!project) {
      throw new NotFoundException('Project not found');
    }

    return project;
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a project' })
  @ApiParam({
    name: 'id',
    description: 'Project id',
    type: String,
    required: true,
  })
  @ApiOkResponse({
    description: 'The project has been successfully updated.',
    type: ProjectDto,
  })
  @ApiNotFoundResponse({
    description: 'The record does not exist',
  })
  async update(
    @Param('id') id: string,
    @Body() updateProjectDto: UpdateProjectDto,
  ): Promise<ProjectDto> {
    return await this.projectService.update(id, updateProjectDto);
  }

  @Delete(':id')
  @HttpCode(204)
  @ApiOperation({ summary: 'Delete Project' })
  @ApiParam({
    name: 'id',
    type: String,
    description: 'Project id',
  })
  @ApiNoContentResponse({
    description: 'The record has been successfully deleted.',
  })
  @ApiNotFoundResponse({
    description: 'The record does not exist',
  })
  async remove(@Param('id') id: string) {
    await this.projectService.remove(id);
  }
}
