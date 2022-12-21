import { Injectable } from '@nestjs/common';
import * as postmark from 'postmark';
@Injectable()
export class EmailService {
  private client = new postmark.ServerClient(
    'aee1ddf8-7636-4809-91a6-96e4373bb289',
  ); //TODO bring from env

  sendEmail(email: postmark.Models.Message) {
    this.client.sendEmail(email);
  }
}
