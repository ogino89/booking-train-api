import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { PrismaModule } from '../../adapters/prisma/prisma.module';
import { CreateUserDto } from './dto/create-user.dto';
import { BcryptService } from '../../adapters/bcrypt/bcrypt.service';
import { ExceptionsService } from '../../adapters/exceptions/exceptions.service';
import { LoggerService } from '../../adapters/logger/logger.service';
import { BcryptModule } from '../../adapters/bcrypt/bcrypt.module';

@Module({
  imports: [PrismaModule, BcryptModule],
  controllers: [UserController],
  providers: [
    CreateUserDto,
    UserService,
    BcryptService,
    ExceptionsService,
    LoggerService,
  ],
  exports: [UserService, CreateUserDto],
})
export class UserModule {}
