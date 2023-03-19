import { Module } from '@nestjs/common';
import { TrainTicketService } from './train-ticket.service';
import { TrainTicketController } from './train-ticket.controller';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [TrainTicketController],
  providers: [TrainTicketService],
  exports: [TrainTicketService],
})
export class TrainTicketModule {}
