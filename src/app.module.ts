import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ExceptionsModule } from './infrastructure/adapters/exceptions/exceptions.module';
import { LoggerModule } from './infrastructure/adapters/logger/logger.module';
import { PrismaModule } from './infrastructure/adapters/prisma/prisma.module';
import { AuthModule } from './infrastructure/module/auth/auth.module';
import { UserModule } from './infrastructure/module//user/user.module';
import { TripModule } from './infrastructure/module//trip/trip.module';
import { HelperModule } from './infrastructure/common/helper/helper.module';
import { SeatModule } from './infrastructure/module//seat/seat.module';
import { BookingModule } from './infrastructure/module//booking/booking.module';
import { TrainTicketModule } from './infrastructure/module//train-ticket/train-ticket.module';
import { SendMailModule } from './infrastructure/module//send-mail/send-mail.module';
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
