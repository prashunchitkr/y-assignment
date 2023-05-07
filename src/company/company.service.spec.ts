import { Test, TestingModule } from '@nestjs/testing';
import { CompanyService } from './company.service';
import { PrismaService } from '@/prisma/prisma.service';

jest.mock('@/prisma/prisma.service', () => ({
  PrismaService: jest.fn().mockImplementation(() => ({
    company: {
      findUnique: jest.fn(),
      findMany: jest.fn(),
    },
  })),
}));

describe('CompanyService', () => {
  let service: CompanyService;
  let prismaService: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CompanyService, PrismaService],
    }).compile();

    service = module.get<CompanyService>(CompanyService);
    prismaService = module.get<PrismaService>(PrismaService);
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

      jest.spyOn(prismaService.company, 'findUnique').mockResolvedValue(result);

      const company = await service.findOne('1');

      expect(company).toStrictEqual({
        ...result,
        projects,
      });
    });

    it('should return null if company does not exist', async () => {
      jest.spyOn(prismaService.company, 'findUnique').mockResolvedValue(null);

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

      jest.spyOn(prismaService.company, 'findMany').mockResolvedValue(result);

      const companies = await service.findAll();

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
      jest.spyOn(prismaService.company, 'findMany').mockResolvedValue(result);

      const companies = await service.findAll(
        0,
        10,
        undefined,
        undefined,
        true,
      );

      expect(companies).toStrictEqual(result);
    });
  });
});
