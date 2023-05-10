import { PrismaService } from '@/prisma/prisma.service';
import { Test, TestingModule } from '@nestjs/testing';
import { DeepMockProxy, mockDeep } from 'jest-mock-extended';
import { ProjectService } from '../project.service';

describe('ProjectService', () => {
  let service: ProjectService;
  let prismaService: DeepMockProxy<PrismaService>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ProjectService, PrismaService],
    })
      .overrideProvider(PrismaService)
      .useValue(mockDeep<PrismaService>())
      .compile();

    service = module.get<ProjectService>(ProjectService);
    prismaService = module.get(PrismaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should throw an error if company and university are not provided', async () => {
      const project = {
        name: 'Test',
        description: 'Test description',
      };

      await expect(service.create(project)).rejects.toThrow(
        'You must provide a company or a university',
      );
    });

    it('should create a project when only company provided', async () => {
      const project = {
        name: 'Test',
        description: 'Test description',
        company: '1',
      };

      const createdProject = {
        id: '1',
        name: 'Test',
        description: 'Test description',
        companyId: '1',
        universityId: null,
      };

      prismaService.project.create.mockResolvedValueOnce(createdProject);
      prismaService.company.findUnique.mockResolvedValueOnce({
        id: '1',
        name: 'Test',
        description: 'Test description',
      });

      expect(await service.create(project)).toBe(createdProject);
    });

    it('should create a project when only university provided', async () => {
      const project = {
        name: 'Test',
        description: 'Test description',
        university: '1',
      };

      const createdProject = {
        id: '1',
        name: 'Test',
        description: 'Test description',
        companyId: null,
        universityId: '1',
      };

      prismaService.project.create.mockResolvedValueOnce(createdProject);
      prismaService.university.findUnique.mockResolvedValueOnce({
        id: '1',
        name: 'Test',
        description: 'Test description',
      });

      expect(await service.create(project)).toBe(createdProject);
    });

    it('should throw an error if company does not exist', async () => {
      const project = {
        name: 'Test',
        description: 'Test description',
        company: '1',
      };

      prismaService.company.findUnique.mockResolvedValueOnce(null);

      await expect(service.create(project)).rejects.toThrow(
        'Company does not exist',
      );
    });
  });
});
