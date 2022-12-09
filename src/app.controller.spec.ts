import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from './app.controller';
import { AppService } from './app.service';

describe('AppController', () => {
  let appController: AppController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
      providers: [AppService],
    }).compile();

    appController = app.get<AppController>(AppController);
  });

  describe.skip('root', () => {
    it('should return unauthenticated for no user', async () => {
      expect(
        await appController.login({ user: { email: 'test.user@test.com' } }),
      ).toEqual({ user: { email: 'test.user@test.com' } });
    });
  });
});
