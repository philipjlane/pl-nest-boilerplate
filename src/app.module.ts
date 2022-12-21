import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import * as Joi from 'joi';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { HttpSessionGuard } from './auth/guards/http-session.guard';
import { APP_GUARD } from '@nestjs/core';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { EmailService } from './email/email.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: ['.env.development.local', '.env.development', '.env'],
      isGlobal: true,
      cache: true,
      validationSchema: Joi.object({
        NODE_ENV: Joi.string()
          .valid('development', 'production', 'test')
          .required(),
        PORT: Joi.number().required(),
        MONGO_URI: Joi.string().required(),
      }),
    }),
    ThrottlerModule.forRoot({
      ttl: 60,
      limit: 10,
    }),
    MongooseModule.forRootAsync({
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        uri: configService.get<string>('MONGO_URI'),
        ssl:
          configService.get<string>('NODE_ENV') === 'production'
            ? true
            : undefined,
        sslValidate:
          configService.get<string>('NODE_ENV') === 'production'
            ? true
            : undefined,
        sslCA:
          configService.get<string>('NODE_ENV') === 'production'
            ? `${__dirname}/root/dbaas_ca_cert.crt`
            : undefined,
      }),
    }),
    UsersModule,
    AuthModule,
  ],
  providers: [
    {
      // Throttle requests
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
    {
      // Protect all routes with Http Session Guard by default
      provide: APP_GUARD,
      useClass: HttpSessionGuard,
    },
    EmailService,
  ],
})
export class AppModule {}
