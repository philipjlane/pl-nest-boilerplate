import { Controller, Request, Post, UseGuards } from '@nestjs/common';
import { Public } from './auth/decorators/public.decorator';
import { LocalAuthGuard } from './auth/guards/local-auth.guard';

@Controller()
export class AppController {
  @UseGuards(LocalAuthGuard)
  @Public()
  @Post('auth/login')
  async login(@Request() req) {
    return req.user;
  }
}
