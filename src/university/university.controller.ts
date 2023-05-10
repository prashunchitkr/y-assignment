import { ApiSearchDecorator } from '@/utils/decorators/api-search-query.decorator';
import { ZodParseBoolPipe, ZodParseIntPipe } from '@/utils/zod';
import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  HttpCode,
  NotFoundException,
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
  CreateUniversityDto,
  UniversityDto,
  UniversityPreviewDto,
  UpdateUniversityDto,
} from './dto';
import { IUniversityService } from './university.service.abstract';

@Controller('university')
@ApiTags('University')
export class UniversityController {
  constructor(private readonly universityService: IUniversityService) {}

  @Post()
  @ApiOperation({ summary: 'Create university' })
  @ApiCreatedResponse({
    description: 'The record has been sucessfully created',
    type: UniversityDto,
  })
  async create(
    @Body() createUniversityDto: CreateUniversityDto,
  ): Promise<UniversityPreviewDto> {
    return await this.universityService.create(createUniversityDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get universities with pagination and search' })
  @ApiSearchDecorator()
  @ApiQuery({
    name: 'professors',
    required: false,
    type: Boolean,
    description: 'Include professor data in the result',
  })
  @ApiQuery({
    name: 'students',
    required: false,
    type: Boolean,
    description: 'Include student data in the result',
  })
  @ApiOkResponse({
    description: 'The records has been sucessfully retrieved',
    type: [UniversityPreviewDto],
  })
  async findAll(
    @Query('skip', new ZodParseIntPipe({ default: 0 })) skip: number,
    @Query('take', new ZodParseIntPipe({ default: 10 })) take: number,
    @Query('name') name?: string,
    @Query('description') description?: string,
    @Query('students', new ZodParseBoolPipe()) includeStudents?: boolean,
    @Query('professors', new ZodParseBoolPipe()) includeProfessors?: boolean,
  ): Promise<UniversityPreviewDto[]> {
    return await this.universityService.findAll({
      skip,
      take,
      name,
      description,
      includeStudents,
      includeProfessors,
    });
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get university by id' })
  @ApiOkResponse({
    description: 'The record has been sucessfully retrieved',
    type: UniversityDto,
  })
  async findOne(@Param('id') id: string): Promise<UniversityDto> {
    const university = await this.universityService.findOne(id);

    if (!university) {
      throw new NotFoundException('University not found');
    }

    return university;
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update university by id' })
  @ApiOkResponse({
    description: 'The record has been sucessfully updated',
    type: UniversityDto,
  })
  async update(
    @Param('id') id: string,
    @Body() updateUniversityDto: UpdateUniversityDto,
  ): Promise<UniversityDto> {
    return await this.universityService.update(id, updateUniversityDto);
  }

  @Delete(':id')
  @HttpCode(204)
  @ApiOperation({ summary: 'Delete university by id' })
  @ApiNoContentResponse({
    description: 'The record has been sucessfully deleted',
  })
  async remove(@Param('id') id: string) {
    return await this.universityService.remove(id);
  }
}
