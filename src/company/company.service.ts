import { Injectable } from '@nestjs/common';
import { CreateCompanyDto, UpdateCompanyDto } from './dto';
import { PrismaService } from '@/prisma/prisma.service';
import { CompanyDto } from './dto/company.dto';
import { CompanyPreviewDto } from './dto/company-preview.dto';

@Injectable()
export class CompanyService {
  readonly previewSelector = {
    id: true,
    name: true,
    description: true,
  };

  constructor(private readonly prisma: PrismaService) {}

  /**
   * Create a company entity
   * @param createCompanyDto Data to create a company entity
   * @returns Newly created company entity
   */
  async create(createCompanyDto: CreateCompanyDto): Promise<CompanyPreviewDto> {
    return await this.prisma.company.create({
      data: createCompanyDto,
      select: this.previewSelector,
    });
  }

  /**
   * Get all companies. Optionally include projects and paginate
   * @param skip Number of records to skip
   * @param take Number of records to take
   * @param name Name to search
   * @param description Description to search
   * @param includeProjects Include projects in the response
   * @returns List of companies
   */
  async findAll(
    skip?: number,
    take?: number,
    name?: string,
    description?: string,
    includeProjects = false,
  ): Promise<CompanyPreviewDto[]> {
    return await this.prisma.company.findMany({
      where: {
        AND: [
          name ? { name: { search: name } } : {},
          description ? { description: { search: description } } : {},
        ],
      },
      skip,
      take,
      select: {
        ...this.previewSelector,
        ...(includeProjects && {
          projects: {
            select: this.previewSelector,
          },
        }),
      },
    });
  }

  /**
   * Get a company by id
   * @param id Company id
   * @returns Company and its projects
   */
  async findOne(id: string): Promise<CompanyDto | null> {
    const company = await this.prisma.company.findUnique({
      where: { id },
      select: {
        ...this.previewSelector,
        projects: {
          select: this.previewSelector,
        },
      },
    });

    return company;
  }

  /**
   * Update a company entity
   * @param id Company id
   * @param updateCompanyDto Data to update a company entity
   * @returns Updated company entity and its projects
   */
  async update(
    id: string,
    updateCompanyDto: UpdateCompanyDto,
  ): Promise<CompanyDto> {
    return await this.prisma.company.update({
      where: { id },
      data: updateCompanyDto,
      select: {
        ...this.previewSelector,
        projects: {
          select: this.previewSelector,
        },
      },
    });
  }

  /**
   * Delete a company entity
   * @param id Company id
   */
  async remove(id: string) {
    await this.prisma.company.delete({
      where: { id },
    });
  }
}
