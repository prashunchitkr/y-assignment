import { PrismaService } from '@/prisma/prisma.service';
import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import {
  CreateStudentDto,
  StudentDto,
  StudentPreviewDto,
  UpdateStudentDto,
} from './dto';
import { IFindAllQuery, IStudentService } from './student.service.abstract';

@Injectable()
export class StudentService implements IStudentService {
  readonly previewSelector = {
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
  async create(createStudentDto: CreateStudentDto): Promise<StudentPreviewDto> {
    return await this.prisma.student.create({
      data: {
        name: createStudentDto.name,
        description: createStudentDto.description,
      },
      select: this.previewSelector,
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
        ...this.previewSelector,
        ...(includeUniversity && {
          university: {
            select: this.previewSelector,
          },
        }),
        ...(includeProfessor && {
          professor: {
            select: this.previewSelector,
          },
        }),
      },
    });
  }

  async findOne(id: string): Promise<StudentDto | null> {
    const student = await this.prisma.student.findUnique({
      where: { id },
      select: {
        ...this.previewSelector,
        university: {
          select: this.previewSelector,
        },
        professor: {
          select: this.previewSelector,
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
    const student = await this.findOne(id);

    if (!student) {
      throw new NotFoundException('Student not found');
    }

    if (updateStudentDto.university) {
      const university = await this.prisma.university.findUnique({
        where: {
          id: updateStudentDto.university,
        },
      });

      if (!university) {
        throw new NotFoundException('University not found');
      }

      const oldUniversityStudents = await this.prisma.student.findMany({
        where: {
          universityId: updateStudentDto.university,
        },
      });

      if (oldUniversityStudents.length === 1) {
        throw new BadRequestException(
          'University must have at least one student',
        );
      }
    }

    if (updateStudentDto.professor) {
      const professor = await this.prisma.professor.findUnique({
        where: {
          id: updateStudentDto.professor,
        },
      });

      if (!professor) {
        throw new NotFoundException('Professor not found');
      }
    }

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
        ...this.previewSelector,
        university: {
          select: this.previewSelector,
        },
        professor: {
          select: this.previewSelector,
        },
      },
    });
  }

  /**
   * Delete a student entity
   * @param id Id of the student to delete
   * @returns Deleted student entity
   */
  async remove(id: string) {
    const student = await this.findOne(id);

    if (!student) {
      throw new NotFoundException('Student not found');
    }

    await this.prisma.student.delete({ where: { id } });
  }

  async getProfessorStudents(
    professorId: string,
  ): Promise<StudentPreviewDto[]> {
    return await this.prisma.student.findMany({
      where: { professorId },
      select: this.previewSelector,
    });
  }
}
