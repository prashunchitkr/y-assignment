import { PrismaService } from '@/prisma/prisma.service';
import { ProfessorModule } from '@/professor/professor.module';
import { UniversityModule } from '@/university/university.module';
import { Test, TestingModule } from '@nestjs/testing';
import { StudentService } from '../student.service';

describe('StudentService', () => {
  let service: StudentService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [StudentService, PrismaService],
      imports: [UniversityModule, ProfessorModule],
    }).compile();

    service = module.get<StudentService>(StudentService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
