import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UsersModule } from '../users/users.module';
import { PassportModule } from '@nestjs/passport';
import { LocalStrategy } from './strategies/local.strategy';
import { SessionSerializer } from './session.serializer';
import { AuthController } from './auth.controller';
import { LinkedInStrategy } from './strategies/linkedin.strategy';

@Module({
  imports: [UsersModule, PassportModule.register({ session: true })],
  providers: [SessionSerializer, AuthService, LocalStrategy, LinkedInStrategy],
  controllers: [AuthController],
})
export class AuthModule {}
