import { Global, Module } from '@nestjs/common';
import { PrismaHelperService } from './prisma-helper/prisma-helper.service';

@Global()
@Module({
  providers: [PrismaHelperService],
  exports: [PrismaHelperService]
})
export class HelperModule {}
