import { Injectable } from '@nestjs/common';
import { PgnotificationService } from './pgnotification/pgnotification.service';

@Injectable()
export class AppService {
  constructor(private readonly pgNotificationService: PgnotificationService) {}
}
