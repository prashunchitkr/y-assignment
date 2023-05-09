import { Global, Module } from '@nestjs/common';
import { PgnotificationService } from './pgnotification.service';

@Global()
@Module({
  providers: [PgnotificationService],
  exports: [PgnotificationService],
})
export class PgnotificationModule {}
