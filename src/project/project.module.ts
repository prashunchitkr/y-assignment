import { forwardRef, Module } from '@nestjs/common';
import { ProjectService } from './project.service';
import { ProjectController } from './project.controller';
import { PrismaModule } from '@/prisma/prisma.module';
import { CompanyModule } from '@/company/company.module';

@Module({
  controllers: [ProjectController],
  providers: [ProjectService],
  exports: [ProjectService],
  imports: [PrismaModule, forwardRef(() => CompanyModule)],
})
export class ProjectModule {}
