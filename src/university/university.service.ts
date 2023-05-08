import { PrismaService } from '@/prisma/prisma.service';
import { IProfessorService } from '@/professor/professor.service.abstract';
import { IStudentService } from '@/student/student.service.abstract';
import {
  BadRequestException,
  forwardRef,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import {
  CreateUniversityDto,
  UniversityDto,
  UniversityPreviewDto,
  UpdateUniversityDto,
} from './dto';
import {
  IFindAllQuery,
  IUniversityService,
} from './university.service.abstract';

@Injectable()
export class UniversityService implements IUniversityService {
  readonly previewSelector = {
    id: true,
    name: true,
    description: true,
  };

  constructor(
    private readonly prisma: PrismaService,
    @Inject(forwardRef(() => IStudentService))
    private readonly studentService: IStudentService,
    @Inject(forwardRef(() => IProfessorService))
    private readonly professorService: IProfessorService,
  ) {}

  async create(
    createUniversityDto: CreateUniversityDto,
  ): Promise<UniversityPreviewDto> {
    const students = await this.studentService.findManyByIds(
      createUniversityDto.students,
    );

    if (students.length !== createUniversityDto.students.length) {
      throw new BadRequestException('One or more students were not found');
    }

    const professors = await this.professorService.findManyByIds(
      createUniversityDto.professors,
    );

    if (professors.length !== createUniversityDto.professors.length) {
      throw new BadRequestException('One or more professors were not found');
    }

    return await this.prisma.university.create({
      data: {
        ...createUniversityDto,
        students: {
          connect: students.map((student) => ({ id: student.id })),
        },
        professors: {
          connect: professors.map((professor) => ({ id: professor.id })),
        },
      },
      select: this.previewSelector,
    });
  }

  async findAll({
    skip,
    take,
    name,
    description,
    includeStudents,
    includeProfessors,
  }: IFindAllQuery): Promise<UniversityPreviewDto[]> {
    return await this.prisma.university.findMany({
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
        ...(includeStudents && {
          students: {
            select: this.previewSelector,
          },
        }),
        ...(includeProfessors && {
          professors: {
            select: this.previewSelector,
          },
        }),
      },
    });
  }

  async findOne(id: string): Promise<UniversityDto | null> {
    const university = await this.prisma.university.findUnique({
      where: { id },
      select: {
        ...this.previewSelector,
        students: {
          select: this.previewSelector,
        },
        professors: {
          select: this.previewSelector,
        },
      },
    });

    return university;
  }

  async update(
    id: string,
    updateUniversityDto: UpdateUniversityDto,
  ): Promise<UniversityDto> {
    const university = await this.findOne(id);

    if (!university) {
      throw new NotFoundException('University not found');
    }

    return await this.prisma.university.update({
      where: { id },
      data: {
        name: updateUniversityDto.name,
        description: updateUniversityDto.description,
      },
      select: {
        ...this.previewSelector,
        students: {
          select: this.previewSelector,
        },
        professors: {
          select: this.previewSelector,
        },
      },
    });
  }

  async remove(id: string): Promise<void> {
    const university = await this.findOne(id);

    if (!university) {
      throw new NotFoundException('University not found');
    }

    await this.prisma.university.delete({ where: { id } });
  }
}
