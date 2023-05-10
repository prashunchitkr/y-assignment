import { Test, TestingModule } from '@nestjs/testing';
import { CompanyService } from '../company.service';
import { PrismaService } from '@/prisma/prisma.service';
import { DeepMockProxy, mockDeep } from 'jest-mock-extended';
import { NotFoundException } from '@nestjs/common';

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

  describe('remove', () => {
    it('should delete a company', async () => {
      const company = {
        id: '1',
        name: 'Company 1',
        description: 'Company 1 description',
      };

      prismaService.company.findUnique.mockResolvedValue(company);
      prismaService.company.delete.mockResolvedValue(company);

      expect(service.remove('1')).resolves.not.toThrow();
    });

    it('should throw an error if company does not exist', async () => {
      prismaService.company.findUnique.mockResolvedValue(null);

      await expect(() => service.remove('1')).rejects.toThrow(
        NotFoundException,
      );
    });
  });
});
