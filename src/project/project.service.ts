import { PrismaService } from '@/prisma/prisma.service';
import { Injectable } from '@nestjs/common';
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

  constructor(private readonly prisma: PrismaService) {}

  /**
   * Create a project entity. You must provide a university or a company id
   * @param createProjectDto  Data to create a project entity
   * @returns Newly created project entity
   */
  async create(createProjectDto: CreateProjectDto): Promise<ProjectDto> {
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
    await this.prisma.project.delete({
      where: { id },
    });
  }
}
