import { forwardRef, Module } from '@nestjs/common';
import { StudentService } from './student.service';
import { StudentController } from './student.controller';
import { PrismaModule } from '@/prisma/prisma.module';
import { IStudentService } from './student.service.abstract';
import { UniversityModule } from '@/university/university.module';
import { ProfessorModule } from '@/professor/professor.module';

@Module({
  controllers: [StudentController],
  providers: [
    {
      provide: IStudentService,
      useClass: StudentService,
    },
  ],
  exports: [IStudentService],
  imports: [
    PrismaModule,
    forwardRef(() => UniversityModule),
    forwardRef(() => ProfessorModule),
  ],
})
export class StudentModule {}
