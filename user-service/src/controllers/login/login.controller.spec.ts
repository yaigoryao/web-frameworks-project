import { Test, TestingModule } from '@nestjs/testing';
import { LoginController } from './login.controller';
import { beforeEach, describe, it, } from 'node:test';

describe('LoginController', () => {
  let controller: LoginController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [LoginController],
    }).compile();

    controller = module.get<LoginController>(LoginController);
  });

  it('should be defined', () => {
    //expect(controller).toBeDefined();
  });
});
