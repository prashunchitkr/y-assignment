import { Module } from '@nestjs/common';
import { APP_INTERCEPTOR, APP_PIPE } from '@nestjs/core';
import { ZodSerializerInterceptor, ZodValidationPipe } from 'nestjs-zod';
import { CompanyModule } from './company/company.module';
import { ProfessorModule } from './professor/professor.module';
import { ProjectModule } from './project/project.module';
import { StudentModule } from './student/student.module';

@Module({
  providers: [
    {
      provide: APP_PIPE,
      useClass: ZodValidationPipe,
    },
    { provide: APP_INTERCEPTOR, useClass: ZodSerializerInterceptor },
  ],
  imports: [CompanyModule, ProjectModule, StudentModule, ProfessorModule],
})
export class AppModule {}
