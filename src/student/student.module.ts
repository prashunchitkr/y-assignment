import { Module } from '@nestjs/common';
import { StudentService } from './student.service';
import { StudentController } from './student.controller';
import { PrismaModule } from '@/prisma/prisma.module';
import { IStudentService } from './student.service.abstract';

@Module({
  controllers: [StudentController],
  providers: [
    {
      provide: IStudentService,
      useClass: StudentService,
    },
  ],
  exports: [IStudentService],
  imports: [PrismaModule],
})
export class StudentModule {}
