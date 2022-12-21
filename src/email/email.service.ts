import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as postmark from 'postmark';
@Injectable()
export class EmailService {
  constructor(private configService: ConfigService) {}

  private client = new postmark.ServerClient(
    this.configService.getOrThrow<string>('POSTMARK_API_KEY'),
  );

  sendEmail(email: postmark.Models.Message) {
    this.client.sendEmail(email);
  }
}
