import { ICompanyService } from '@/company/company.service.abstract';
import { PrismaService } from '@/prisma/prisma.service';
import { IUniversityService } from '@/university/university.service.abstract';
import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import {
  CreateProjectDto,
  ProjectDto,
  ProjectPreviewDto,
  UpdateProjectDto,
} from './dto';
import { IFindAllQuery, IProjectService } from './project.service.abstract';

@Injectable()
export class ProjectService implements IProjectService {
  readonly #previewSelector = {
    id: true,
    name: true,
    description: true,
  };

  constructor(
    private readonly prisma: PrismaService,
    private readonly companyService: ICompanyService,
    private readonly universityService: IUniversityService,
  ) {}

  /**
   * Create a project entity. You must provide a university or a company id
   * @param createProjectDto  Data to create a project entity
   * @returns Newly created project entity
   */
  async create(createProjectDto: CreateProjectDto): Promise<ProjectDto> {
    if (createProjectDto.company) {
      const company = await this.companyService.findOne(
        createProjectDto.company,
      );
      if (!company) {
        throw new BadRequestException('Company does not exist');
      }
    }

    if (createProjectDto.university) {
      const university = await this.universityService.findOne(
        createProjectDto.university,
      );

      if (!university) {
        throw new BadRequestException('University does not exist');
      }
    }

    if (createProjectDto.company) {
      const company = await this.companyService.findOne(
        createProjectDto.company,
      );
      if (!company) {
        throw new BadRequestException('Company does not exist');
      }
    }

    return await this.prisma.project.create({
      data: {
        name: createProjectDto.name,
        description: createProjectDto.description,
        company: createProjectDto.company
          ? {
              connect: { id: createProjectDto.company },
            }
          : undefined,
        university: createProjectDto.university
          ? {
              connect: { id: createProjectDto.university },
            }
          : undefined,
      },
      select: {
        ...this.#previewSelector,
        company: {
          select: this.#previewSelector,
        },
        university: {
          select: this.#previewSelector,
        },
      },
    });
  }

  /**
   * Get all projects. Optionally include company and university and paginate
   * @param query Query parameters
   * @returns
   */
  async findAll({
    skip,
    take,
    name,
    description,
    includeCompany = false,
    includeUniversity = false,
  }: IFindAllQuery): Promise<ProjectPreviewDto[]> {
    return await this.prisma.project.findMany({
      where: {
        AND: [
          name ? { name: { search: name } } : {},
          description ? { description: { search: description } } : {},
        ],
      },
      skip,
      take,
      select: {
        ...this.#previewSelector,
        ...(includeCompany && {
          company: {
            select: this.#previewSelector,
          },
        }),
        ...(includeUniversity && {
          university: {
            select: this.#previewSelector,
          },
        }),
      },
    });
  }

  /**
   * Get a project entity by id
   * @param id  Project id
   * @returns Project entity
   */
  async findOne(id: string): Promise<ProjectDto | null> {
    const project = await this.prisma.project.findUnique({
      where: { id },
      select: {
        ...this.#previewSelector,
        company: {
          select: this.#previewSelector,
        },
        university: {
          select: this.#previewSelector,
        },
      },
    });

    return project;
  }

  /**
   * Update a project entity
   * @param id Id of the project to update
   * @param updateProjectDto Data to update a project entity
   * @returns Updated project entity
   */
  async update(
    id: string,
    updateProjectDto: UpdateProjectDto,
  ): Promise<ProjectDto> {
    if (updateProjectDto.company) {
      const company = await this.companyService.findOne(
        updateProjectDto.company,
      );
      if (!company) {
        throw new BadRequestException(
          `Company ${updateProjectDto.company} does not exist`,
        );
      }
    }

    if (updateProjectDto.university) {
      const university = await this.universityService.findOne(
        updateProjectDto.university,
      );
      if (!university) {
        throw new BadRequestException(
          `University ${updateProjectDto.university} does not exist`,
        );
      }
    }

    if (updateProjectDto.university) {
      const university = await this.companyService.findOne(
        updateProjectDto.university,
      );
      if (!university) {
        throw new BadRequestException(
          `University ${updateProjectDto.university} does not exist`,
        );
      }
    }

    return await this.prisma.project.update({
      where: { id },
      data: {
        name: updateProjectDto.name,
        description: updateProjectDto.description,
        ...(updateProjectDto.company && {
          company: {
            connect: { id: updateProjectDto.company },
          },
        }),
        ...(updateProjectDto.university && {
          university: {
            connect: { id: updateProjectDto.university },
          },
        }),
      },
      select: {
        ...this.#previewSelector,
        company: {
          select: this.#previewSelector,
        },
        university: {
          select: this.#previewSelector,
        },
      },
    });
  }

  /**
   * Delete a project
   * @param id Id of project to delete
   */
  async remove(id: string) {
    const project = await this.findOne(id);

    if (!project) throw new NotFoundException(`Project with ${id} not found`);

    await this.prisma.project.delete({
      where: { id },
    });
  }
}
