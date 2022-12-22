import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as cookieParser from 'cookie-parser';
import * as session from 'express-session';
import * as passport from 'passport';
import * as MongoDBStore from 'connect-mongodb-session';
import { ConfigService } from '@nestjs/config';
import helmet from 'helmet';
import { NestExpressApplication } from '@nestjs/platform-express';
async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  // Config
  const configService = app.get(ConfigService);
  const isProductionEnvironment =
    configService.getOrThrow<string>('NODE_ENV') === 'production';

  // Security
  app.use(helmet());

  if (isProductionEnvironment) {
    app.set('trust proxy', true);
  }

  // CORS
  app.enableCors({
    credentials: true,
    origin: configService.getOrThrow<string>('CLIENT_URL'),
  });

  // AUTO DTO Validation
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, //Strip unexpected props from DTOs
    }),
  );

  // Parse Cookies
  app.use(cookieParser(configService.getOrThrow<string>('SESSION_SECRET')));

  // Passport
  app.use(passport.initialize());

  // Sessions
  const mongoStore = MongoDBStore(session);
  const store = new mongoStore({
    uri: configService.getOrThrow<string>('MONGO_URI'),
    collection: 'sessions',
  });
  app.use(
    session({
      secret: configService.getOrThrow<string>('SESSION_SECRET'),
      resave: false,
      saveUninitialized: false,
      name: configService.getOrThrow<string>('SESSION_COOKIE_NAME'),
      cookie: {
        secure: isProductionEnvironment,
        // maxAge: 1000 * 60 * 60 * 24 * 7, // 1 week
      },
      store: store,
    }),
  );
  app.use(passport.session());

  // Start HTTP Server
  await app.listen(configService.getOrThrow<string>('PORT'));
}
bootstrap();
