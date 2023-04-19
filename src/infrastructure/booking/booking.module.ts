import { Module } from '@nestjs/common';
import { BookingService } from './booking.service';
import { BookingController } from './booking.controller';
import { PrismaModule } from '../prisma/prisma.module';
import { TrainTicketService } from '../train-ticket/train-ticket.service';
import { SeatService } from '../seat/seat.service';
import { SendMailService } from '../send-mail/send-mail.service';

@Module({
  imports: [PrismaModule],
  controllers: [BookingController],
  providers: [BookingService, TrainTicketService, SeatService, SendMailService],
})
export class BookingModule {}
