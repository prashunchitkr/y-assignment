import { PrismaService } from '@/prisma/prisma.service';
import { Injectable } from '@nestjs/common';
import { StudentDto } from './dto';
import { CreateStudentDto } from './dto/create-student.dto';
import { UpdateStudentDto } from './dto/update-student.dto';

interface IFindAllQuery {
  skip?: number;
  take?: number;
  name?: string;
  description?: string;
  includeUniversity?: boolean;
  includeProfessor?: boolean;
}

@Injectable()
export class StudentService {
  readonly #previewSelector = {
    id: true,
    name: true,
    description: true,
  };

  constructor(private readonly prisma: PrismaService) {}

  /**
   * Create a student entity. You must provide a university and a professor id
   * @param createStudentDto  Data to create a student entity
   * @returns Newly created student entity
   */
  async create(createStudentDto: CreateStudentDto) {
    return await this.prisma.student.create({
      data: {
        name: createStudentDto.name,
        description: createStudentDto.description,
        university: {
          connect: { id: createStudentDto.university },
        },
        professor: {
          connect: { id: createStudentDto.professor },
        },
      },
      select: {
        ...this.#previewSelector,
        university: {
          select: this.#previewSelector,
        },
        professor: {
          select: this.#previewSelector,
        },
      },
    });
  }

  /**
   * Get all students. Optionally include university and professor and paginate
   * @param querty Query parameters
   * @returns List of students
   */
  async findAll({
    skip,
    take,
    name,
    description,
    includeUniversity,
    includeProfessor,
  }: IFindAllQuery) {
    return await this.prisma.student.findMany({
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
        ...(includeProfessor && {
          professor: {
            select: this.#previewSelector,
          },
        }),
      },
    });
  }

  async findOne(id: string): Promise<StudentDto | null> {
    const student = await this.prisma.student.findUnique({
      where: { id },
      select: {
        ...this.#previewSelector,
        university: {
          select: this.#previewSelector,
        },
        professor: {
          select: this.#previewSelector,
        },
      },
    });

    return student;
  }

  /**
   * Update a student entity
   * @param id Id of the student to update
   * @param updateStudentDto Data to update the student
   * @returns Updated student entity
   */
  async update(
    id: string,
    updateStudentDto: UpdateStudentDto,
  ): Promise<StudentDto> {
    return await this.prisma.student.update({
      where: { id },
      data: {
        name: updateStudentDto.name,
        description: updateStudentDto.description,
        ...(updateStudentDto.university && {
          university: {
            connect: { id: updateStudentDto.university },
          },
        }),
        ...(updateStudentDto.professor && {
          professor: {
            connect: { id: updateStudentDto.professor },
          },
        }),
      },
      select: {
        ...this.#previewSelector,
        university: {
          select: this.#previewSelector,
        },
        professor: {
          select: this.#previewSelector,
        },
      },
    });
  }

  /**
   * Delete a student entity
   * @param id Id of the student to delete
   * @returns Deleted student entity
   * @throws {Prisma.PrismaClientKnownRequestError} If the student does not exist
   * @throws {Prisma.PrismaClientKnownRequestError} If the student has a relation with a university
   * @throws {Prisma.PrismaClientKnownRequestError} If the student has a relation with a professor
   */
  async remove(id: string) {
    await this.prisma.student.delete({ where: { id } });
  }

  /**
   * Check if a student record exists for the given id
   * @param id Id of the student to check
   * @returns True if the student exists, false otherwise
   */
  async studentExists(id: string): Promise<boolean> {
    const student = await this.prisma.student.findUnique({ where: { id } });
    return !!student;
  }
}
