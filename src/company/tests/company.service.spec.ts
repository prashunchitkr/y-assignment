import { Test, TestingModule } from '@nestjs/testing';
import { CompanyService } from '../company.service';
import { PrismaService } from '@/prisma/prisma.service';
import { DeepMockProxy, mockDeep } from 'jest-mock-extended';

describe('CompanyService', () => {
  let service: CompanyService;
  let prismaService: DeepMockProxy<PrismaService>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CompanyService, PrismaService],
    })
      .overrideProvider(PrismaService)
      .useValue(mockDeep<PrismaService>())
      .compile();

    service = module.get<CompanyService>(CompanyService);
    prismaService = module.get(PrismaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findOne', () => {
    it("should return a company and it's projects", async () => {
      const projects = [
        {
          id: '1',
          name: 'Project 1',
          description: 'Project 1 description',
        },
      ];
      const result = {
        id: '1',
        name: 'Company 1',
        description: 'Company 1 description',
        projects,
      };

      prismaService.company.findUnique.mockResolvedValue(result);

      const company = await service.findOne('1');

      expect(company).toStrictEqual({
        ...result,
        projects,
      });
    });

    it('should return null if company does not exist', async () => {
      prismaService.company.findUnique.mockResolvedValue(null);

      const company = await service.findOne('1');

      expect(company).toBeNull();
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

      prismaService.company.findMany.mockResolvedValue(result);

      const companies = await service.findAll({
        skip: 0,
        take: 10,
        name: undefined,
        description: undefined,
        includeProjects: false,
      });

      expect(companies).toStrictEqual(result);
    });

    it('should return a list of companies with projects', async () => {
      const project = {
        id: '1',
        name: 'Project 1',
        description: 'Project Description',
      };

      const result = [
        {
          id: '1',
          name: 'Company 1',
          description: 'Company 1 description',
          projcts: [project],
        },
        {
          id: '2',
          name: 'Company 2',
          description: 'Company 2 description',
          projcts: [project],
        },
      ];

      prismaService.company.findMany.mockResolvedValue(result);

      const companies = await service.findAll({
        skip: 0,
        take: 10,
        name: undefined,
        description: undefined,
        includeProjects: true,
      });

      expect(companies).toStrictEqual(result);
    });
  });
});
