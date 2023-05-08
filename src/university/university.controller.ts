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
    return this.universityService.create(createUniversityDto);
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
  findAll(
    @Query('skip', new ZodParseIntPipe({ default: 0 })) skip: number,
    @Query('take', new ZodParseIntPipe({ default: 10 })) take: number,
    @Query('name') name?: string,
    @Query('description') description?: string,
    @Query('students', new ZodParseBoolPipe()) includeStudents?: boolean,
    @Query('professors', new ZodParseBoolPipe()) includeProfessors?: boolean,
  ) {
    return this.universityService.findAll({
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
  findOne(@Param('id') id: string) {
    return this.universityService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update university by id' })
  @ApiOkResponse({
    description: 'The record has been sucessfully updated',
    type: UniversityDto,
  })
  update(
    @Param('id') id: string,
    @Body() updateUniversityDto: UpdateUniversityDto,
  ) {
    return this.universityService.update(id, updateUniversityDto);
  }

  @Delete(':id')
  @HttpCode(204)
  @ApiOperation({ summary: 'Delete university by id' })
  @ApiNoContentResponse({
    description: 'The record has been sucessfully deleted',
  })
  remove(@Param('id') id: string) {
    return this.universityService.remove(id);
  }
}
