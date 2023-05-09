import { PrismaService } from '@/prisma/prisma.service';
import { ProjectModule } from '@/project/project.module';
import { Test, TestingModule } from '@nestjs/testing';
import { UniversityService } from '../university.service';

describe('UniversityService', () => {
  let service: UniversityService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PrismaService, UniversityService],
      imports: [ProjectModule],
    }).compile();

    service = module.get<UniversityService>(UniversityService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
