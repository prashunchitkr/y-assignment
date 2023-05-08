import { forwardRef, Module } from '@nestjs/common';
import { UniversityService } from './university.service';
import { UniversityController } from './university.controller';
import { IUniversityService } from './university.service.abstract';
import { StudentModule } from '@/student/student.module';
import { ProfessorModule } from '@/professor/professor.module';
import { ProjectModule } from '@/project/project.module';
import { PrismaModule } from '@/prisma/prisma.module';

@Module({
  controllers: [UniversityController],
  providers: [
    {
      provide: IUniversityService,
      useClass: UniversityService,
    },
  ],
  exports: [IUniversityService],
  imports: [
    PrismaModule,
    forwardRef(() => StudentModule),
    forwardRef(() => ProfessorModule),
    forwardRef(() => ProjectModule),
  ],
})
export class UniversityModule {}
