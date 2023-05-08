import { Module } from '@nestjs/common';
import { ProfessorService } from './professor.service';
import { ProfessorController } from './professor.controller';
import { PrismaModule } from '@/prisma/prisma.module';
import { StudentModule } from '@/student/student.module';

@Module({
  controllers: [ProfessorController],
  providers: [ProfessorService],
  imports: [PrismaModule, StudentModule],
})
export class ProfessorModule {}
