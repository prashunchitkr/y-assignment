import { PrismaService } from '@/prisma/prisma.service';
import { UniversityModule } from '@/university/university.module';
import { Test, TestingModule } from '@nestjs/testing';
import { ProfessorService } from './professor.service';

describe('ProfessorService', () => {
  let service: ProfessorService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ProfessorService, PrismaService],
      imports: [UniversityModule],
    }).compile();

    service = module.get<ProfessorService>(ProfessorService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
