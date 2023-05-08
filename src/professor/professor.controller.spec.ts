import { PrismaService } from '@/prisma/prisma.service';
import { Test, TestingModule } from '@nestjs/testing';
import { ProfessorController } from './professor.controller';
import { ProfessorService } from './professor.service';

describe('ProfessorController', () => {
  let controller: ProfessorController;
  let prismaService: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProfessorController],
      providers: [ProfessorService, PrismaService],
    }).compile();

    controller = module.get<ProfessorController>(ProfessorController);
    prismaService = module.get<PrismaService>(PrismaService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
