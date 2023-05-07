import { PrismaService } from '@/prisma/prisma.service';
import { NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { CompanyController } from './company.controller';
import { CompanyService } from './company.service';

jest.mock('@/prisma/prisma.service', () => ({
  PrismaService: jest.fn().mockImplementation(() => ({
    company: {
      findUnique: jest.fn(),
    },
  })),
}));

describe('CompanyController', () => {
  let controller: CompanyController;
  let prismaService: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CompanyController],
      providers: [CompanyService, PrismaService],
    }).compile();

    controller = module.get<CompanyController>(CompanyController);
    prismaService = module.get<PrismaService>(PrismaService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('findOne', () => {
    it('should throw exception if company not found', async () => {
      // Arrange
      jest.spyOn(prismaService.company, 'findUnique').mockResolvedValue(null);

      // Act
      const result = () => controller.findOne('1');

      // Assert
      expect(result).rejects.toThrow(NotFoundException);
    });

    it('should return company of provided id', async () => {
      // Arrange
      const company = {
        id: '1',
        name: 'Company',
        description: 'Company description',
        projects: [],
      };

      jest
        .spyOn(prismaService.company, 'findUnique')
        .mockResolvedValue(company);

      // Act
      const result = await controller.findOne('1');

      // Assert
      expect(result).toStrictEqual(company);
    });
  });
});
