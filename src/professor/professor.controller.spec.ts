import { PrismaService } from '@/prisma/prisma.service';
import { StudentModule } from '@/student/student.module';
import { Test, TestingModule } from '@nestjs/testing';
import { ProfessorController } from './professor.controller';
import { ProfessorService } from './professor.service';
import { IProfessorService } from './professor.service.abstract';

describe('ProfessorController', () => {
  let controller: ProfessorController;
  let prismaService: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProfessorController],
      providers: [
        {
          provide: IProfessorService,
          useClass: ProfessorService,
        },
        PrismaService,
      ],
      imports: [StudentModule],
    }).compile();

    controller = module.get<ProfessorController>(ProfessorController);
    prismaService = module.get<PrismaService>(PrismaService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
