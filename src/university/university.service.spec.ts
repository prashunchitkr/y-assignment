import { PrismaService } from '@/prisma/prisma.service';
import { ProfessorModule } from '@/professor/professor.module';
import { ProjectModule } from '@/project/project.module';
import { StudentModule } from '@/student/student.module';
import { Test, TestingModule } from '@nestjs/testing';
import { UniversityService } from './university.service';

describe('UniversityService', () => {
  let service: UniversityService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PrismaService, UniversityService],
      imports: [StudentModule, ProfessorModule, ProjectModule],
    }).compile();

    service = module.get<UniversityService>(UniversityService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
