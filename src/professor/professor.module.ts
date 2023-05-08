import { Module } from '@nestjs/common';
import { ProfessorService } from './professor.service';
import { ProfessorController } from './professor.controller';
import { PrismaModule } from '@/prisma/prisma.module';
import { StudentModule } from '@/student/student.module';
import { IProfessorService } from './professor.service.abstract';

@Module({
  controllers: [ProfessorController],
  providers: [
    {
      provide: IProfessorService,
      useClass: ProfessorService,
    },
  ],
  exports: [IProfessorService],
  imports: [PrismaModule, StudentModule],
})
export class ProfessorModule {}
