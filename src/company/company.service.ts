import { PrismaService } from '@/prisma/prisma.service';
import { Injectable, NotFoundException } from '@nestjs/common';
import { ICompanyService, IFindAllQuery } from './company.service.abstract';
import {
  CompanyDto,
  CompanyPreviewDto,
  CreateCompanyDto,
  UpdateCompanyDto,
} from './dto';

@Injectable()
export class CompanyService implements ICompanyService {
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
   * @param querty Query parameters
   * @returns List of companies
   */
  async findAll({
    skip,
    take,
    name,
    description,
    includeProjects = false,
  }: IFindAllQuery): Promise<CompanyPreviewDto[]> {
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
    const company = this.findOne(id);

    if (!company) {
      throw new NotFoundException(`Company ${id} not found`);
    }

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
    const company = await this.findOne(id);

    if (!company) {
      throw new NotFoundException('Company not found');
    }

    await this.prisma.company.delete({
      where: { id },
    });
  }
}
