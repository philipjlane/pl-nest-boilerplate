import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from './entities/user.entity';
import * as paginate from 'mongoose-paginate-v2';
import { EmailService } from '../email/email.service';

@Module({
  imports: [
    MongooseModule.forFeatureAsync([
      {
        name: User.name,
        useFactory: () => {
          const schema = UserSchema;
          schema.plugin(paginate); //https://www.npmjs.com/package/mongoose-paginate-v2
          return schema;
        },
      },
    ]),
  ],
  controllers: [UsersController],
  providers: [UsersService, EmailService],
  exports: [UsersService, MongooseModule],
})
export class UsersModule {}
