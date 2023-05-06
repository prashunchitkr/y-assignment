import { forwardRef, Module } from '@nestjs/common';
import { CompanyService } from './company.service';
import { CompanyController } from './company.controller';
import { PrismaModule } from '@/prisma/prisma.module';
import { ProjectModule } from '@/project/project.module';

@Module({
  controllers: [CompanyController],
  providers: [CompanyService],
  exports: [CompanyService],
  imports: [PrismaModule, forwardRef(() => ProjectModule)],
})
export class CompanyModule {}
