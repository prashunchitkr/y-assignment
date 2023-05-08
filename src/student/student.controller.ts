import { ApiSearchDecorator } from '@/utils/decorators/api-search-query.decorator';
import { ZodParseBoolPipe, ZodParseIntPipe } from '@/utils/zod';
import {
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
import {
  CreateStudentDto,
  StudentDto,
  StudentPreviewDto,
  UpdateStudentDto,
} from './dto';
import { IStudentService } from './student.service.abstract';

@Controller('student')
@ApiTags('Student')
export class StudentController {
  constructor(private readonly studentService: IStudentService) {}

  @Post()
  @ApiOperation({ summary: 'Create student' })
  @ApiCreatedResponse({
    type: StudentPreviewDto,
    description: 'The record has been sucessfully created',
  })
  async create(
    @Body() createStudentDto: CreateStudentDto,
  ): Promise<StudentPreviewDto> {
    return await this.studentService.create(createStudentDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get students with pagination and search' })
  @ApiSearchDecorator()
  @ApiQuery({
    name: 'professor',
    required: false,
    type: Boolean,
    description: 'Include professor data in the result',
  })
  @ApiQuery({
    name: 'university',
    required: false,
    type: Boolean,
    description: 'Include university data in the result',
  })
  @ApiOkResponse({
    type: [StudentPreviewDto],
    description: 'The records has been successfully retrieved',
  })
  async findAll(
    @Query('skip', new ZodParseIntPipe({ default: 0 })) skip: number,
    @Query('take', new ZodParseIntPipe({ default: 10 })) take: number,
    @Query('name') name?: string,
    @Query('description') description?: string,
    @Query('professor', new ZodParseBoolPipe()) professor = false,
    @Query('university', new ZodParseBoolPipe()) university = false,
  ): Promise<StudentPreviewDto[]> {
    return this.studentService.findAll({
      skip,
      take,
      name,
      description,
      includeProfessor: professor,
      includeUniversity: university,
    });
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get student by id' })
  @ApiParam({
    name: 'id',
    type: String,
    description: 'Student id',
  })
  @ApiOkResponse({
    type: StudentDto,
    description: 'The record has been successfully retrieved',
  })
  async findOne(@Param('id') id: string): Promise<StudentDto> {
    const student = await this.studentService.findOne(id);

    if (!student) {
      throw new NotFoundException(`Student with id ${id} not found`);
    }

    return student;
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update student by id' })
  @ApiParam({
    name: 'id',
    type: String,
    description: 'Student id',
  })
  @ApiOkResponse({
    type: StudentDto,
    description: 'The record has been successfully updated',
  })
  @ApiNotFoundResponse({
    description: 'Student with id not found',
  })
  async update(
    @Param('id') id: string,
    @Body() updateStudentDto: UpdateStudentDto,
  ): Promise<StudentDto> {
    return this.studentService.update(id, updateStudentDto);
  }

  @Delete(':id')
  @HttpCode(204)
  @ApiOperation({ summary: 'Delete student by id' })
  @ApiParam({
    name: 'id',
    type: String,
    description: 'Student id',
  })
  @ApiNoContentResponse({
    description: 'The record has been successfully deleted',
  })
  async remove(@Param('id') id: string) {
    await this.studentService.remove(id);
  }
}
