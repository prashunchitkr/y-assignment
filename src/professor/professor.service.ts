import { PrismaService } from '@/prisma/prisma.service';
import { Injectable } from '@nestjs/common';
import {
  CreateProfessorDto,
  ProfessorDto,
  ProfessorPreviewDto,
  UpdateProfessorDto,
} from './dto';

interface IFindAllQuery {
  skip?: number;
  take?: number;
  name?: string;
  description?: string;
  includeUniversity?: boolean;
  includeStudents?: boolean;
}

@Injectable()
export class ProfessorService {
  readonly #previewSelector = {
    id: true,
    name: true,
    description: true,
  };

  constructor(private readonly prisma: PrismaService) {}

  /**
   * Create a professor entity. You must provide a university id
   * @param createProfessorDto Data to create a professor entity
   * @returns Newly created professor entity
   */
  async create(createProfessorDto: CreateProfessorDto): Promise<ProfessorDto> {
    return await this.prisma.professor.create({
      data: {
        ...createProfessorDto,
        university: {
          connect: {
            id: createProfessorDto.university,
          },
        },
      },
      select: {
        ...this.#previewSelector,
        university: {
          select: this.#previewSelector,
        },
        students: {
          select: this.#previewSelector,
        },
      },
    });
  }

  /**
   * Get all professors. Optionally include university and students and paginate
   * @param query Query parameters
   * @returns List of professors
   */
  async findAll({
    skip,
    take,
    name,
    description,
    includeUniversity,
    includeStudents,
  }: IFindAllQuery): Promise<ProfessorPreviewDto[]> {
    return await this.prisma.professor.findMany({
      skip,
      take,
      where: {
        AND: [
          name ? { name: { contains: name } } : {},
          description ? { description: { contains: description } } : {},
        ],
      },
      select: {
        ...this.#previewSelector,
        ...(includeUniversity && {
          university: {
            select: this.#previewSelector,
          },
        }),
        ...(includeStudents && {
          students: {
            select: this.#previewSelector,
          },
        }),
      },
    });
  }

  /**
   * Get a professor by id, include university and students
   * @param id Id of the professor to find
   * @returns Professor entity
   */
  async findOne(id: string): Promise<ProfessorDto | null> {
    const professor = await this.prisma.professor.findUnique({
      where: { id },
      select: {
        ...this.#previewSelector,
        university: {
          select: this.#previewSelector,
        },
        students: {
          select: this.#previewSelector,
        },
      },
    });

    return professor;
  }

  /**
   * Update a professor entity
   * @param id Id of the professor to update
   * @param updateProfessorDto Data to update the professor entity
   * @returns Updated professor entity
   */
  async update(
    id: string,
    updateProfessorDto: UpdateProfessorDto,
  ): Promise<ProfessorDto> {
    return await this.prisma.professor.update({
      where: { id },
      data: {
        name: updateProfessorDto.name,
        description: updateProfessorDto.description,
        ...(updateProfessorDto.university && {
          university: {
            connect: { id: updateProfessorDto.university },
          },
        }),
      },
      select: {
        ...this.#previewSelector,
        university: {
          select: this.#previewSelector,
        },
        students: {
          select: this.#previewSelector,
        },
      },
    });
  }

  async remove(id: string) {
    return await this.prisma.professor.delete({
      where: { id },
    });
  }

  async getStudents(id: string) {
    const result = await this.prisma.professor.findUnique({
      where: { id },
      select: {
        students: {
          select: {
            id: true,
            name: true,
            description: true,
          },
        },
      },
    });

    return result?.students ?? [];
  }
}
