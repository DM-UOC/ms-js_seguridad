import { Test, TestingModule } from '@nestjs/testing';
import { SubmenusService } from './submenus.service';

describe('SubmenusService', () => {
  let service: SubmenusService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SubmenusService],
    }).compile();

    service = module.get<SubmenusService>(SubmenusService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
