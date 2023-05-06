import { Test, TestingModule } from '@nestjs/testing';
import { CompanyService } from './company.service';
import { PrismaService } from '@/prisma/prisma.service';
import { ProjectService } from '@/project/project.service';

jest.mock('@/prisma/prisma.service', () => ({
  PrismaService: jest.fn().mockImplementation(() => ({
    company: {
      findUnique: jest.fn(),
      findMany: jest.fn(),
    },
  })),
}));
jest.mock('@/project/project.service', () => ({
  ProjectService: jest.fn().mockImplementation(() => ({
    findCompanyProjects: jest.fn(),
  })),
}));

describe('CompanyService', () => {
  let service: CompanyService;
  let prismaService: PrismaService;
  let projectService: ProjectService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CompanyService, PrismaService, ProjectService],
    }).compile();

    service = module.get<CompanyService>(CompanyService);
    prismaService = module.get<PrismaService>(PrismaService);
    projectService = module.get<ProjectService>(ProjectService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findOne', () => {
    it("should return a company and it's projects", async () => {
      const result = {
        id: '1',
        name: 'Company 1',
        description: 'Company 1 description',
      };

      const projects = [
        {
          id: '1',
          name: 'Project 1',
          description: 'Project 1 description',
        },
      ];

      jest.spyOn(prismaService.company, 'findUnique').mockResolvedValue(result);
      jest
        .spyOn(projectService, 'findCompanyProjects')
        .mockResolvedValue(projects);

      const company = await service.findOne('1');

      expect(company).toStrictEqual({
        ...result,
        projects,
      });
    });

    it('should throw an error if company does not exist', async () => {
      jest.spyOn(prismaService.company, 'findUnique').mockResolvedValue(null);

      await expect(service.findOne('1')).rejects.toThrow(
        "Company with id 1 doesn't exist",
      );
    });
  });

  describe('findAll', () => {
    it('should return a list of companies', async () => {
      const result = [
        {
          id: '1',
          name: 'Company 1',
          description: 'Company 1 description',
        },
        {
          id: '2',
          name: 'Company 2',
          description: 'Company 2 description',
        },
      ];

      jest.spyOn(prismaService.company, 'findMany').mockResolvedValue(result);

      const companies = await service.findAll();

      expect(companies).toStrictEqual(result);
    });

    it('should return a list of companies with projects', async () => {
      const result = [
        {
          id: '1',
          name: 'Company 1',
          description: 'Company 1 description',
        },
        {
          id: '2',
          name: 'Company 2',
          description: 'Company 2 description',
        },
      ];

      const project = {
        id: '1',
        name: 'Project 1',
        description: 'Project Description',
      };

      jest.spyOn(prismaService.company, 'findMany').mockResolvedValue(result);
      jest
        .spyOn(projectService, 'findCompanyProjects')
        .mockResolvedValue([project]);

      const companies = await service.findAll(0, 10, true);

      expect(companies).toStrictEqual(
        companies.map((c) => ({
          ...c,
          projects: [project],
        })),
      );
    });
  });
});
