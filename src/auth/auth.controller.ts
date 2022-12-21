import {
  Controller,
  Request,
  Post,
  UseGuards,
  Get,
  Redirect,
  HttpCode,
  Query,
} from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { Public } from './decorators/public.decorator';
import { LinkedInAuthGuard } from './guards/linkedin-auth.guard';
import { LocalAuthGuard } from './guards/local-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private userService: UsersService) {}
  // Local Login
  @UseGuards(LocalAuthGuard)
  @Public()
  @Post('login')
  @HttpCode(200)
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
  @Redirect('http://localhost:9000/home', 301) //TODO Make this a sensible client side target from env
  linkedInAuthCallback() {
    return;
  }

  // Auth Check
  @Get('who-am-i')
  whoAmI(@Request() req) {
    return req.user;
  }

  // Logout
  // @UseGuards(LocalAuthGuard)
  @Public()
  @Get('logout')
  @HttpCode(204)
  async logout(@Request() req) {
    return req.session.destroy();
  }

  // Reset Password
  @Public()
  @Get('reset-password')
  @HttpCode(204)
  async resetPassword(@Query('email') email) {
    return this.userService.resetPassword(email);
  }
}
