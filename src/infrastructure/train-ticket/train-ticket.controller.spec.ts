import { Test, TestingModule } from '@nestjs/testing';
import { TrainTicketController } from './train-ticket.controller';
import { TrainTicketService } from './train-ticket.service';

describe('TrainTicketController', () => {
  let controller: TrainTicketController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TrainTicketController],
      providers: [TrainTicketService],
    }).compile();

    controller = module.get<TrainTicketController>(TrainTicketController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
