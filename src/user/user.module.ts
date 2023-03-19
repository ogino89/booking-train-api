import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { PrismaModule } from 'src/prisma/prisma.module';
import { CreateUserDto } from './dto/create-user.dto';

@Module({
  imports: [PrismaModule],
  controllers: [UserController],
  providers: [UserService, CreateUserDto],
  exports: [UserService, CreateUserDto],
})
export class UserModule {}
