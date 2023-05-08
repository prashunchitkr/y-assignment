import { PrismaService } from '@/prisma/prisma.service';
import { ProfessorModule } from '@/professor/professor.module';
import { ProjectModule } from '@/project/project.module';
import { StudentModule } from '@/student/student.module';
import { Test, TestingModule } from '@nestjs/testing';
import { UniversityController } from './university.controller';
import { UniversityService } from './university.service';
import { IUniversityService } from './university.service.abstract';

describe('UniversityController', () => {
  let controller: UniversityController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UniversityController],
      providers: [
        {
          provide: IUniversityService,
          useClass: UniversityService,
        },
        PrismaService,
      ],
      imports: [StudentModule, ProfessorModule, ProjectModule],
    }).compile();

    controller = module.get<UniversityController>(UniversityController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
