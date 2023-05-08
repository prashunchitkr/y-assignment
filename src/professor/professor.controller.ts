import { IStudentService } from '@/student/student.service.abstract';
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
  ApiOkResponse,
  ApiOperation,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import {
  ProfessorDto,
  CreateProfessorDto,
  UpdateProfessorDto,
  ProfessorPreviewDto,
} from './dto';
import { IProfessorService } from './professor.service.abstract';

@Controller('professor')
@ApiTags('Professor')
export class ProfessorController {
  constructor(
    private readonly professorService: IProfessorService,
    private readonly studentService: IStudentService,
  ) {}

  @Post()
  @ApiOperation({ summary: 'Create a professor' })
  @ApiCreatedResponse({
    description: 'The professor has been successfully created.',
    type: ProfessorPreviewDto,
  })
  async create(
    @Body() createProfessorDto: CreateProfessorDto,
  ): Promise<ProfessorPreviewDto> {
    // TODO: Check if university exists

    return await this.professorService.create(createProfessorDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all professors with pagination and search' })
  @ApiSearchDecorator()
  @ApiQuery({
    name: 'university',
    required: false,
    type: Boolean,
    description: 'Include university data in the result',
  })
  @ApiQuery({
    name: 'students',
    required: false,
    type: Boolean,
    description: 'Include students data in the result',
  })
  @ApiOkResponse({
    description: 'The professors have been successfully retrieved.',
    type: [ProfessorPreviewDto],
  })
  findAll(
    @Query('skip', new ZodParseIntPipe({ default: 0 })) skip: number,
    @Query('take', new ZodParseIntPipe({ default: 10 })) take: number,
    @Query('name') name?: string,
    @Query('description') description?: string,
    @Query('university', new ZodParseBoolPipe()) university = false,
    @Query('students', new ZodParseBoolPipe()) students = false,
  ): Promise<ProfessorPreviewDto[]> {
    return this.professorService.findAll({
      skip,
      take,
      name,
      description,
      includeUniversity: university,
      includeStudents: students,
    });
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a professor by id' })
  @ApiOkResponse({
    type: ProfessorDto,
    description: 'The professor has been successfully retrieved.',
  })
  async findOne(@Param('id') id: string): Promise<ProfessorDto> {
    const professor = await this.professorService.findOne(id);

    if (!professor) {
      throw new NotFoundException(`Professor with id ${id} not found`);
    }

    return professor;
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a professor' })
  @ApiOkResponse({
    type: ProfessorDto,
    description: 'The professor has been successfully updated.',
  })
  async update(
    @Param('id') id: string,
    @Body() updateProfessorDto: UpdateProfessorDto,
  ): Promise<ProfessorDto> {
    const professor = await this.professorService.findOne(id);

    if (!professor) {
      throw new NotFoundException(`Professor with id ${id} not found`);
    }

    return this.professorService.update(id, updateProfessorDto);
  }

  @Delete(':id')
  @HttpCode(204)
  @ApiOperation({ summary: 'Delete a professor' })
  @ApiNoContentResponse({
    description: 'The professor has been successfully deleted.',
  })
  async remove(@Param('id') id: string) {
    const professor = await this.professorService.findOne(id);

    if (!professor) {
      throw new NotFoundException(`Professor with id ${id} not found`);
    }

    const students = await this.studentService.getProfessorStudents(id);

    if (students.length > 0) {
      throw new BadRequestException('Cannot delete professor with students');
    }

    return await this.professorService.remove(id);
  }
}
