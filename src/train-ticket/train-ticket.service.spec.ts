import { Test, TestingModule } from '@nestjs/testing';
import { TrainTicketService } from './train-ticket.service';

describe('TrainTicketService', () => {
  let service: TrainTicketService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TrainTicketService],
    }).compile();

    service = module.get<TrainTicketService>(TrainTicketService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
