import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpCode,
  Query,
} from '@nestjs/common';
import { CompanyService } from './company.service';
import { CreateCompanyDto, UpdateCompanyDto, CompanyPreviewDto } from './dto';
import { CompanyDto } from './dto/company.dto';
import {
  ApiCreatedResponse,
  ApiNoContentResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import { ZodNumberValiatonPipe } from '@/utils/zod-number-validation.pipe';

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
  @ApiOkResponse({
    type: [CompanyPreviewDto],
    description: 'The records has been successfully retrieved.',
  })
  async findAll(
    @Query('skip', new ZodNumberValiatonPipe({ default: 0 })) skip: number,
    @Query('take', new ZodNumberValiatonPipe({ default: 10 })) take: number,
  ): Promise<CompanyPreviewDto[]> {
    return this.companyService.findAll(skip, take);
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
    return this.companyService.searchByNameAndDescription(name, description);
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
    return await this.companyService.findOne(id);
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
  update(
    @Param('id') id: string,
    @Body() updateCompanyDto: UpdateCompanyDto,
  ): Promise<CompanyDto> {
    return this.companyService.update(id, updateCompanyDto);
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
  remove(@Param('id') id: string) {
    return this.companyService.remove(id);
  }
}
