import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards,
} from '@nestjs/common';
import { SeatService } from './seat.service';
import { CreateSeatDto } from './dto/create-seat.dto';
import { UpdateSeatDto } from './dto/update-seat.dto';
import { ApiBearerAuth, ApiQuery, ApiTags } from '@nestjs/swagger';
import { PrismaHelperService } from 'src/helper/prisma-helper/prisma-helper.service';
import { Prisma } from '@prisma/client';
import { JwtGuard } from 'src/auth/guards/jwt.guard';

@ApiBearerAuth()
@UseGuards(JwtGuard)
@ApiTags('Seat')
@Controller('seat')
export class SeatController {
  constructor(
    private readonly seatService: SeatService,
    private prismaHelperService: PrismaHelperService,
  ) {}

  @Post()
  async create(@Body() createSeatDto: CreateSeatDto) {
    return await this.seatService.create(<Prisma.SeatCreateInput>createSeatDto);
  }

  @Get()
  @ApiQuery({ name: 'args', required: false })
  async findAll(@Query('args') prismaArgs: string) {
    return await this.seatService.findAll(
      this.prismaHelperService.parsePrismaArgs(prismaArgs),
    );
  }

  @Get(':id')
  @ApiQuery({ name: 'args', required: false })
  async findOne(@Param('id') id: string, @Query('args') prismaArgs: string) {
    return await this.seatService.findOne(
      id,
      this.prismaHelperService.parsePrismaArgs(prismaArgs),
    );
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateSeatDto: UpdateSeatDto) {
    return await this.seatService.update(
      id,
      <Prisma.SeatUpdateInput>updateSeatDto,
    );
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return await this.seatService.remove(id);
  }
}
