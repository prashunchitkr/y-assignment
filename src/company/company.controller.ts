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
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import { CompanyService } from './company.service';
import { CompanyPreviewDto, CreateCompanyDto, UpdateCompanyDto } from './dto';
import { CompanyDto } from './dto/company.dto';

@Controller('company')
@ApiTags('Company')
export class CompanyController {
  constructor(private readonly companyService: CompanyService) {}

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
  @ApiOperation({ summary: 'Get companies' })
  @ApiQuery({
    name: 'skip',
    required: false,
    type: Number,
    description: 'Number of records to skip. Default 0',
  })
  @ApiQuery({
    name: 'take',
    required: false,
    type: Number,
    description: 'Number of records to take. Default 10',
  })
  @ApiQuery({
    name: 'projects',
    required: false,
    type: Boolean,
    description: 'Include projects dadta in the result',
  })
  @ApiOkResponse({
    type: [CompanyPreviewDto],
    description: 'The records has been successfully retrieved.',
  })
  async findAll(
    @Query('skip', new ZodParseIntPipe({ default: 0 })) skip: number,
    @Query('take', new ZodParseIntPipe({ default: 10 })) take: number,
    @Query('projects', new ZodParseBoolPipe()) includeProjects?: boolean,
  ): Promise<CompanyPreviewDto[]> {
    return await this.companyService.findAll(skip, take, includeProjects);
  }

  @Get('search')
  @ApiOperation({ summary: 'Search companies by name' })
  @ApiQuery({
    name: 'name',
    required: false,
    type: String,
    description: 'Search by name',
  })
  @ApiQuery({
    name: 'description',
    required: false,
    type: String,
    description: 'Search by description',
  })
  @ApiOkResponse({
    type: [CompanyPreviewDto],
    description: 'The records has been successfully retrieved.',
  })
  async searchByNameAndDescription(
    @Query('name') name?: string,
    @Query('description') description?: string,
  ) {
    return await this.companyService.searchByNameAndDescription(
      name,
      description,
    );
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
  async update(
    @Param('id') id: string,
    @Body() updateCompanyDto: UpdateCompanyDto,
  ): Promise<CompanyDto> {
    const company = this.companyService.findOne(id);
    if (!company) {
      throw new NotFoundException(`Company ${id} not found`);
    }
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
  async remove(@Param('id') id: string) {
    try {
      await this.companyService.findOne(id);
    } catch (error) {
      throw new NotFoundException(`Company ${id} not found`);
    }

    await this.companyService.remove(id);
  }
}
