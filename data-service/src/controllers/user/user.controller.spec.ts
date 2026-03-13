import { Test, TestingModule } from '@nestjs/testing';
import { CustomersUserController } from './user.controller';

describe('UserController', () => {
  let controller: CustomersUserController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CustomersUserController],
    }).compile();

    controller = module.get<CustomersUserController>(CustomersUserController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
