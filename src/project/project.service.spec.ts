import { Test, TestingModule } from '@nestjs/testing';
import { ProjectService } from './project.service';
import { PrismaModule } from '@/prisma/prisma.module';
import { CompanyModule } from '@/company/company.module';

jest.mock('@/prisma/prisma.service');
jest.mock('@/company/company.service');

describe('ProjectService', () => {
  let service: ProjectService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ProjectService],
      imports: [PrismaModule, CompanyModule],
    }).compile();

    service = module.get<ProjectService>(ProjectService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
