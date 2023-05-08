import { PrismaService } from '@/prisma/prisma.service';
import { ProfessorModule } from '@/professor/professor.module';
import { UniversityModule } from '@/university/university.module';
import { Test, TestingModule } from '@nestjs/testing';
import { StudentController } from './student.controller';
import { StudentService } from './student.service';
import { IStudentService } from './student.service.abstract';

describe('StudentController', () => {
  let controller: StudentController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [StudentController],
      providers: [
        {
          provide: IStudentService,
          useClass: StudentService,
        },
        PrismaService,
      ],
      imports: [UniversityModule, ProfessorModule],
    }).compile();

    controller = module.get<StudentController>(StudentController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
