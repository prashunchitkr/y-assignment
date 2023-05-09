import {
  Injectable,
  Logger,
  OnModuleDestroy,
  OnModuleInit,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Client } from 'pg';

@Injectable()
export class PgnotificationService implements OnModuleInit, OnModuleDestroy {
  private readonly pgClient: Client;
  private readonly NOTIFICATION_CHANNEL = 'project_match';
  private readonly logger = new Logger(PgnotificationService.name);

  constructor(private readonly config: ConfigService) {
    this.pgClient = new Client({
      connectionString: this.config.get<string>('DATABASE_URL'),
    });
  }

  async onModuleInit() {
    try {
      this.pgClient.connect();
      this.pgClient.query(`LISTEN ${this.NOTIFICATION_CHANNEL}`);

      this.pgClient.on('notification', (msg) => {
        if (msg.channel === this.NOTIFICATION_CHANNEL && msg.payload) {
          this.#handleProjectMatchNotification(JSON.parse(msg.payload));
        }
      });
    } catch (error) {
      this.logger.error('Error Connecting to Database');
    }
  }

  #handleProjectMatchNotification(projects: any[]): void {
    // Handle Project Match Notification
    // Maybe use websocket to send notification to client
    // Client will be listening to a notificatiuon channel where the server will send the notification
    console.log(projects);
  }

  async onModuleDestroy() {
    try {
      await this.pgClient.query(`UNLISTEN ${this.NOTIFICATION_CHANNEL}`);
    } catch (error) {
      this.logger.error("Error Unlistening to Database's Notification");
    } finally {
      await this.pgClient.end();
    }
  }
}
