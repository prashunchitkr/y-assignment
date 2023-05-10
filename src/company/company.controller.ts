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
import { ICompanyService } from './company.service.abstract';
import { CompanyPreviewDto, CreateCompanyDto, UpdateCompanyDto } from './dto';
import { CompanyDto } from './dto/company.dto';

@Controller('company')
@ApiTags('Company')
export class CompanyController {
  constructor(private readonly companyService: ICompanyService) {}

  @Post()
  @ApiOperation({ summary: 'Create company' })
  @ApiCreatedResponse({
    type: CompanyPreviewDto,
    description: 'The record has been successfully created.',
  })
  async create(
    @Body() createCompanyDto: CreateCompanyDto,
  ): Promise<CompanyPreviewDto> {
    return await this.companyService.create(createCompanyDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get companies with pagination and search' })
  @ApiSearchDecorator()
  @ApiQuery({
    name: 'projects',
    required: false,
    type: Boolean,
    description: 'Include projects data in the result',
  })
  @ApiOkResponse({
    type: [CompanyPreviewDto],
    description: 'The records has been successfully retrieved.',
  })
  async findAll(
    @Query('skip', new ZodParseIntPipe({ default: 0 })) skip: number,
    @Query('take', new ZodParseIntPipe({ default: 10 })) take: number,
    @Query('name') name?: string,
    @Query('description') description?: string,
    @Query('projects', new ZodParseBoolPipe()) includeProjects?: boolean,
  ): Promise<CompanyPreviewDto[]> {
    return await this.companyService.findAll({
      skip,
      take,
      name,
      description,
      includeProjects,
    });
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get company by id' })
  @ApiParam({
    name: 'id',
    type: String,
    description: 'Company id',
  })
  @ApiOkResponse({
    type: CompanyDto,
    description: 'The record has been successfully retrieved.',
  })
  @ApiNotFoundResponse({
    description: 'The record does not exist',
  })
  async findOne(@Param('id') id: string): Promise<CompanyDto> {
    const company = await this.companyService.findOne(id);

    if (!company) {
      throw new NotFoundException(`Company with id ${id} not found`);
    }

    return company;
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update company' })
  @ApiParam({
    name: 'id',
    type: String,
    description: 'Company id',
  })
  @ApiOkResponse({
    type: CompanyDto,
    description: 'The record has been successfully updated.',
  })
  @ApiNotFoundResponse({
    description: 'The record does not exist',
  })
  async update(
    @Param('id') id: string,
    @Body() updateCompanyDto: UpdateCompanyDto,
  ): Promise<CompanyDto> {
    return await this.companyService.update(id, updateCompanyDto);
  }

  @Delete(':id')
  @HttpCode(204)
  @ApiOperation({ summary: 'Delete company' })
  @ApiParam({
    name: 'id',
    type: String,
    description: 'Company id',
  })
  @ApiNoContentResponse({
    description: 'The record has been successfully deleted.',
  })
  @ApiNotFoundResponse({
    description: 'The record does not exist',
  })
  async remove(@Param('id') id: string) {
    await this.companyService.remove(id);
  }
}
