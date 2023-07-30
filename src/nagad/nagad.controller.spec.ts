import { Test, TestingModule } from '@nestjs/testing';
import { NagadController } from './nagad.controller';
import { NagadGatewayService } from './nagad.service';

describe('NagadController', () => {
  let controller: NagadController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [NagadController],
      providers: [NagadGatewayService],
    }).compile();

    controller = module.get<NagadController>(NagadController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
