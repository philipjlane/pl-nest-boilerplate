import { getModelToken, MongooseModule } from '@nestjs/mongoose';
import { PassportModule } from '@nestjs/passport';
import { Test, TestingModule } from '@nestjs/testing';
import { Model } from 'mongoose';
import * as paginate from 'mongoose-paginate-v2';
import { User, UserSchema } from '../users/entities/user.entity';
import { UsersModule } from '../users/users.module';
import { AuthService } from './auth.service';
import { LocalStrategy } from './strategies/local.strategy';

describe('AuthService', () => {
  let service: AuthService;
  let model: Model<User>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        UsersModule,
        PassportModule,
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
      providers: [AuthService, LocalStrategy],
    }).compile();

    service = module.get<AuthService>(AuthService);
    model = module.get<Model<User>>(getModelToken('User'));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
