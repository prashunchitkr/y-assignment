import { CompanyModule } from '@/company/company.module';
import { CompanyService } from '@/company/company.service';
import { PrismaService } from '@/prisma/prisma.service';
import { UniversityModule } from '@/university/university.module';
import { Test, TestingModule } from '@nestjs/testing';
import { ProjectService } from '../project.service';
describe('ProjectService', () => {
  let service: ProjectService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ProjectService, PrismaService, CompanyService],
      imports: [CompanyModule, UniversityModule],
    }).compile();

    service = module.get<ProjectService>(ProjectService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
