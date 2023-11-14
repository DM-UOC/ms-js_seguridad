import { Test, TestingModule } from '@nestjs/testing';
import { SubmenusController } from './submenus.controller';
import { SubmenusService } from './submenus.service';

describe('SubmenusController', () => {
  let controller: SubmenusController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SubmenusController],
      providers: [SubmenusService],
    }).compile();

    controller = module.get<SubmenusController>(SubmenusController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
