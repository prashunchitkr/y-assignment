import { Module } from '@nestjs/common';
import { CompanyService } from './company.service';
import { CompanyController } from './company.controller';
import { PrismaModule } from '@/prisma/prisma.module';
import { ICompanyService } from './company.service.abstract';

@Module({
  controllers: [CompanyController],
  providers: [
    {
      provide: ICompanyService,
      useClass: CompanyService,
    },
  ],
  exports: [ICompanyService],
  imports: [PrismaModule],
})
export class CompanyModule {}
