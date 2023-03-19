import { Module } from '@nestjs/common';
import { BookingService } from './booking.service';
import { BookingController } from './booking.controller';
import { PrismaModule } from 'src/prisma/prisma.module';
import { TrainTicketService } from 'src/train-ticket/train-ticket.service';
import { SeatService } from 'src/seat/seat.service';
import { SendMailService } from 'src/send-mail/send-mail.service';

@Module({
  imports: [PrismaModule],
  controllers: [BookingController],
  providers: [BookingService, TrainTicketService, SeatService, SendMailService],
})
export class BookingModule {}
