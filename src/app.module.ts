import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ExceptionsModule } from './infrastructure/adapters/exceptions/exceptions.module';
import { LoggerModule } from './infrastructure/adapters/logger/logger.module';
import { PrismaModule } from './infrastructure/adapters/prisma/prisma.module';
import { AuthModule } from './infrastructure/modules/auth/auth.module';
import { UserModule } from './infrastructure/modules/user/user.module';
import { TripModule } from './infrastructure/modules/trip/trip.module';
import { HelperModule } from './infrastructure/common/helper/helper.module';
import { SeatModule } from './infrastructure/modules/seat/seat.module';
import { BookingModule } from './infrastructure/modules/booking/booking.module';
import { TrainTicketModule } from './infrastructure/modules/train-ticket/train-ticket.module';
import { SendMailModule } from './infrastructure/modules/send-mail/send-mail.module';
import { BcryptModule } from './infrastructure/adapters/bcrypt/bcrypt.module';

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
