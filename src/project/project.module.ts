import { Module } from '@nestjs/common';
import { ProjectService } from './project.service';
import { ProjectController } from './project.controller';
import { PrismaModule } from '@/prisma/prisma.module';
import { IProjectService } from './project.service.abstract';

@Module({
  controllers: [ProjectController],
  providers: [
    {
      provide: IProjectService,
      useClass: ProjectService,
    },
  ],
  exports: [IProjectService],
  imports: [PrismaModule],
})
export class ProjectModule {}
