import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateCompanyDto, UpdateCompanyDto } from './dto';
import { PrismaService } from '@/prisma/prisma.service';
import { CompanyDto } from './dto/company.dto';
import { CompanyPreviewDto } from './dto/company-preview.dto';
import { ProjectService } from '@/project/project.service';

@Injectable()
export class CompanyService {
  #previewSelector = {
    id: true,
    name: true,
    description: true,
  };

  constructor(
    private readonly prisma: PrismaService,
    private readonly projectService: ProjectService,
  ) {}

  /**
   * Create a company entity
   * @param createCompanyDto Data to create a company entity
   * @returns Newly created company entity
   */
  async create(createCompanyDto: CreateCompanyDto): Promise<CompanyPreviewDto> {
    return await this.prisma.company.create({
      data: createCompanyDto,
      select: this.#previewSelector,
    });
  }

  /**
   * Get all companies. Optionally skip and take records.
   * @param skip Number of records to skip
   * @param take Number of records to take
   * @returns List of companies
   */
  async findAll(
    skip?: number,
    take?: number,
    includeProjects?: boolean,
  ): Promise<CompanyPreviewDto[]> {
    const result: CompanyPreviewDto[] = [];

    const companies = await this.prisma.company.findMany({
      skip,
      take,
      select: this.#previewSelector,
    });

    companies.forEach((company) => result.push(company));

    if (includeProjects) {
      for (let i = 0; i < result.length; i++) {
        const projects = await this.projectService.findCompanyProjects(
          result[i].id,
        );

        result[i].projects = projects;
      }
    }

    return result;
  }

  /**
   * Search companies by name or description
   * @param searchCompanyDto  Data to search a company entity
   * @returns List of companies
   */
  async searchByNameAndDescription(
    name?: string,
    description?: string,
  ): Promise<CompanyPreviewDto[]> {
    return await this.prisma.company.findMany({
      where: {
        AND: [
          name ? { name: { search: name } } : {},
          description ? { description: { search: description } } : {},
        ],
      },
      select: this.#previewSelector,
    });
  }

  /**
   * Get a company by id
   * @param id Company id
   * @returns Company and its projects
   */
  async findOne(id: string): Promise<CompanyDto> {
    const company = await this.prisma.company.findUnique({
      where: { id },
      select: {
        ...this.#previewSelector,
        projects: {
          select: this.#previewSelector,
        },
      },
    });

    if (!company) {
      throw new NotFoundException(`Company with id ${id} doesn't exist`);
    }

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
    try {
      const updatedCompany = await this.prisma.company.update({
        where: { id },
        data: updateCompanyDto,
        select: {
          ...this.#previewSelector,
          projects: {
            select: this.#previewSelector,
          },
        },
      });

      return updatedCompany;
    } catch (error) {
      throw new NotFoundException(`Company with id ${id} doesn't exist`);
    }
  }

  /**
   * Delete a company entity
   * @param id Company id
   */
  async remove(id: string) {
    try {
      await this.prisma.company.delete({
        where: { id },
      });
    } catch (error) {
      throw new NotFoundException(`Company with id ${id} doesn't exist`);
    }
  }
}
