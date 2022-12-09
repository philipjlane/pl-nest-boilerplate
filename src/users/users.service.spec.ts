import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { getModelToken } from '@nestjs/mongoose';
import { User } from './entities/user.entity';
import { Model } from 'mongoose';

// const mockId = new mongoose.Types.ObjectId();

const mockUser = {
  // _id: mockId,
  givenName: 'Test',
  familyName: 'User',
  email: `test.user@app.com`,
};

describe('UsersService', () => {
  let service: UsersService;
  let model: Model<User>;

  const usersArray = [
    {
      // _id: new mongoose.Types.ObjectId(),
      givenName: 'Test',
      familyName: 'User1',
      email: `test.user1@app.com`,
    },
    {
      // _id: new mongoose.Types.ObjectId(),
      givenName: 'Test',
      familyName: 'User2',
      email: `test.user2@app.com`,
    },
  ];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: getModelToken('User'),
          useValue: {
            new: jest.fn().mockResolvedValue(mockUser),
            constructor: jest.fn().mockResolvedValue(mockUser),
            find: jest.fn(),
            create: jest.fn(),
            exec: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
    model = module.get<Model<User>>(getModelToken('User'));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  // TODO Fix this mock
  it.skip('should return all users', async () => {
    jest.spyOn(model, 'find').mockReturnValue({
      exec: jest.fn().mockResolvedValueOnce(usersArray),
    } as any);
    const users = await service.findAll();
    expect('find').toHaveBeenCalled();
    expect(users).toEqual(usersArray);
  });

  it('should insert a new user', async () => {
    jest.spyOn(model, 'create').mockImplementationOnce(() =>
      Promise.resolve({
        givenName: 'Test',
        familyName: 'User',
        email: `test.user@app.com`,
      }),
    );
    const newUser = await service.create({
      givenName: 'Test',
      familyName: 'User',
      email: `test.user@app.com`,
    });
    expect(newUser).toEqual(mockUser);
  });
});
