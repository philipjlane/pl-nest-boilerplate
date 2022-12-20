import {
  Controller,
  Request,
  Post,
  UseGuards,
  Get,
  Redirect,
  Response,
} from '@nestjs/common';
import { Public } from './decorators/public.decorator';
import { LinkedInAuthGuard } from './guards/linkedin-auth.guard';
import { LocalAuthGuard } from './guards/local-auth.guard';

@Controller('auth')
export class AuthController {
  // Local Login
  @UseGuards(LocalAuthGuard)
  @Public()
  @Post('login')
  async login(@Request() req) {
    return req.user;
  }

  // LinkedIn Login / Registration
  @Public()
  @UseGuards(LinkedInAuthGuard)
  @Get('linkedin')
  loginWithLinkedIn() {
    return;
  }

  // LinkedIn Callback
  @Public()
  @UseGuards(LinkedInAuthGuard)
  @Get('linkedin/callback')
  @Redirect('http://localhost:3000/auth/who-am-i', 301) //TODO Make this a sensible client side target
  linkedInAuthCallback() {
    return;
  }

  // Auth Check
  @Get('who-am-i')
  whoAmI(@Request() req) {
    return req.user;
  }
}
