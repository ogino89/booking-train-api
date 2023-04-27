import { Module } from '@nestjs/common';
import { TripService } from './trip.service';
import { TripController } from './trip.controller';
import { PrismaModule } from '../../adapters/prisma/prisma.module';
import { BcryptService } from 'src/infrastructure/adapters/bcrypt/bcrypt.service';
import { ExceptionsService } from 'src/infrastructure/adapters/exceptions/exceptions.service';
import { LoggerService } from 'src/infrastructure/adapters/logger/logger.service';

@Module({
  imports: [PrismaModule],
  controllers: [TripController],
  providers: [TripService, BcryptService, ExceptionsService, LoggerService],
})
export class TripModule {}
