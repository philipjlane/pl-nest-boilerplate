import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as cookieParser from 'cookie-parser';
import * as session from 'express-session';
import * as passport from 'passport';
import * as MongoDBStore from 'connect-mongodb-session';
import { ConfigService } from '@nestjs/config';
import { UserDocument } from './users/entities/user.entity';

// const MongoDBStore = require('connect-mongodb-session')(session);

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { cors: true });

  // Config
  const configService = app.get(ConfigService);
  const isProductionEnvironment =
    configService.getOrThrow<string>('NODE_ENV') === 'production';

  // AUTO DTO Validation
  app.useGlobalPipes(new ValidationPipe());

  // Parse Cookies
  app.use(cookieParser(configService.getOrThrow<string>('SESSION_SECRET')));

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

  // Passport
  app.use(passport.initialize());
  app.use(passport.session());
  // passport.serializeUser((user: UserDocument, cb) => {
  //   const { password, ...result } = user;

  //   console.log(45, result);

  //   return cb(null, user);
  // });

  // passport.deserializeUser((user, cb) => {
  //   console.log(50, user);
  //   return cb(null, user);
  // });

  // Start HTTP Server
  await app.listen(configService.getOrThrow<string>('PORT'));
}
bootstrap();
