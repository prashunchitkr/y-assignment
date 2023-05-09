import { Module } from '@nestjs/common';
import { UniversityService } from './university.service';
import { UniversityController } from './university.controller';
import { IUniversityService } from './university.service.abstract';
import { PrismaModule } from '@/prisma/prisma.module';

@Module({
  controllers: [UniversityController],
  providers: [
    {
      provide: IUniversityService,
      useClass: UniversityService,
    },
  ],
  exports: [IUniversityService],
  imports: [PrismaModule],
})
export class UniversityModule {}
