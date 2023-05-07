import { PrismaService } from '@/prisma/prisma.service';
import { Injectable } from '@nestjs/common';
import { CreateStudentDto } from './dto/create-student.dto';
import { UpdateStudentDto } from './dto/update-student.dto';

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

  findAll() {
    return `This action returns all student`;
  }

  findOne(id: string) {
    return `This action returns a #${id} student`;
  }

  update(id: string, updateStudentDto: UpdateStudentDto) {
    return `This action updates a #${id} student`;
  }

  remove(id: string) {
    return `This action removes a #${id} student`;
  }
}
