import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { HelperModule } from './helper/helper.module';
import { PrismaModule } from './prisma/prisma.module';
import { UserModule } from './user/user.module';
import { TripModule } from './trip/trip.module';
import { SeatModule } from './seat/seat.module';
import { BookingModule } from './booking/booking.module';
import { TrainTicketModule } from './train-ticket/train-ticket.module';
import { SendMailModule } from './send-mail/send-mail.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    PrismaModule,
    AuthModule,
    UserModule,
    TripModule,
    HelperModule,
    SeatModule,
    BookingModule,
    TrainTicketModule,
    SendMailModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
