import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ExceptionsModule } from './infrastructure/adapters/exceptions/exceptions.module';
import { LoggerModule } from './infrastructure/adapters/logger/logger.module';
import { PrismaModule } from './infrastructure/prisma/prisma.module';
import { AuthModule } from './infrastructure/auth/auth.module';
import { UserModule } from './infrastructure/user/user.module';
import { TripModule } from './infrastructure/trip/trip.module';
import { HelperModule } from './infrastructure/helper/helper.module';
import { SeatModule } from './infrastructure/seat/seat.module';
import { BookingModule } from './infrastructure/booking/booking.module';
import { TrainTicketModule } from './infrastructure/train-ticket/train-ticket.module';
import { SendMailModule } from './infrastructure/send-mail/send-mail.module';
import { BcryptModule } from './infrastructure/adapters/bcrypt/bcrypt.module';
import { UserService } from './infrastructure/user/user.service';

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

    ExceptionsModule,
    LoggerModule,
    BcryptModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
