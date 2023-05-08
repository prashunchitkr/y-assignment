import { forwardRef, Module } from '@nestjs/common';
import { ProfessorService } from './professor.service';
import { ProfessorController } from './professor.controller';
import { PrismaModule } from '@/prisma/prisma.module';
import { StudentModule } from '@/student/student.module';
import { IProfessorService } from './professor.service.abstract';
import { UniversityModule } from '@/university/university.module';

@Module({
  controllers: [ProfessorController],
  providers: [
    {
      provide: IProfessorService,
      useClass: ProfessorService,
    },
  ],
  exports: [IProfessorService],
  imports: [
    PrismaModule,
    forwardRef(() => UniversityModule),
    forwardRef(() => StudentModule),
  ],
})
export class ProfessorModule {}
