import { PrismaModule } from '@/prisma/prisma.module';
import { Module } from '@nestjs/common';
import { ProfessorController } from './professor.controller';
import { ProfessorService } from './professor.service';
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
  imports: [PrismaModule],
})
export class ProfessorModule {}
