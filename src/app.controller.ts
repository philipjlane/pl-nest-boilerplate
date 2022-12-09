import {
  Controller,
  Request,
  Post,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import MongooseClassSerializerInterceptor from './!common/interceptors/mongooseClassSerializer.interceptor';
import { LocalAuthGuard } from './auth/guards/local-auth.guard';
import { User } from './users/entities/user.entity';

@UseInterceptors(MongooseClassSerializerInterceptor(User))
@Controller()
export class AppController {
  @UseGuards(LocalAuthGuard)
  @Post('auth/login')
  async login(@Request() req) {
    return req.user;
  }
}
