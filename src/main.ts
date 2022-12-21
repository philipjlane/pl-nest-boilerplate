import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as cookieParser from 'cookie-parser';
import * as session from 'express-session';
import * as passport from 'passport';
import * as MongoDBStore from 'connect-mongodb-session';
import { ConfigService } from '@nestjs/config';
import helmet from 'helmet';
async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    cors: { credentials: true, origin: ['http://localhost:9000'] }, //TODO get value from config service
  });

  // Config
  const configService = app.get(ConfigService);
  const isProductionEnvironment =
    configService.getOrThrow<string>('NODE_ENV') === 'production';

  // Security
  app.use(helmet());

  // AUTO DTO Validation
  app.useGlobalPipes(new ValidationPipe());

  // Parse Cookies
  app.use(cookieParser(configService.getOrThrow<string>('SESSION_SECRET')));

  // Sessions

  // Passport
  app.use(passport.initialize());

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
