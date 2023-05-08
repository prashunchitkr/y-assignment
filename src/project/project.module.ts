import { forwardRef, Module } from '@nestjs/common';
import { ProjectService } from './project.service';
import { ProjectController } from './project.controller';
import { PrismaModule } from '@/prisma/prisma.module';
import { CompanyModule } from '@/company/company.module';
import { IProjectService } from './project.service.abstract';
import { UniversityModule } from '@/university/university.module';

@Module({
  controllers: [ProjectController],
  providers: [
    {
      provide: IProjectService,
      useClass: ProjectService,
    },
  ],
  exports: [IProjectService],
  imports: [PrismaModule, CompanyModule, forwardRef(() => UniversityModule)],
})
export class ProjectModule {}
