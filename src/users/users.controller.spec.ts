import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { CreateUserDto } from './dto/create-user.dto';
import { UsersService } from './users.service';

describe('UsersController', () => {
  let controller: UsersController;
  let service: UsersService;
  const createUserDto: CreateUserDto = {
    givenName: 'Test',
    familyName: 'User',
    email: `test.user@app.com`,
  };

  const mockUser = {
    givenName: 'Test',
    familyName: 'User',
    email: `test.user@app.com`,
    _id: 'a id',
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        {
          provide: UsersService,
          useValue: {
            findAll: jest.fn().mockResolvedValue([
              {
                givenName: 'Test',
                familyName: 'User1',
                email: `test.user1@app.com`,
              },
              {
                givenName: 'Test',
                familyName: 'User2',
                email: `test.user2@app.com`,
              },
              {
                givenName: 'Test',
                familyName: 'User3',
                email: `test.user3@app.com`,
              },
            ]),
            create: jest.fn().mockResolvedValue(createUserDto),
          },
        },
      ],
    }).compile();

    controller = module.get<UsersController>(UsersController);
    service = module.get<UsersService>(UsersService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
