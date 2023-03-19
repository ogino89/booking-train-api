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
  Request,
} from '@nestjs/common';
import { ApiBearerAuth, ApiQuery, ApiTags } from '@nestjs/swagger';
import { Prisma } from '@prisma/client';
import { JwtGuard } from 'src/auth/guards/jwt.guard';
import { PrismaHelperService } from 'src/helper/prisma-helper/prisma-helper.service';
import { BookingService } from './booking.service';
import { CreateBookingWithTicketDto } from './dto/create-booking-with-ticket.dto';
import { CreateBookingDto } from './dto/create-booking.dto';
import { UpdateBookingDto } from './dto/update-booking.dto';

@ApiBearerAuth()
@UseGuards(JwtGuard)
@ApiTags('Booking')
@Controller('booking')
export class BookingController {
  constructor(
    private readonly bookingService: BookingService,
    private prismaHelperService: PrismaHelperService,
  ) {}

  @Post()
  async create(
    @Body() createBookingWithTicketDto: CreateBookingWithTicketDto,
    @Request() req,
  ) {
    return await this.bookingService.createWithTicket(
      req.user.id,
      createBookingWithTicketDto,
    );
  }

  @Post('confirm/:token')
  async confirmBooking(@Param('token') id: string) {
    return await this.bookingService.confirmBooking(id);
  }

  @Get()
  @ApiQuery({ name: 'args', required: false })
  async findAll(@Query('args') prismaArgs: string) {
    return await this.bookingService.findAll(
      this.prismaHelperService.parsePrismaArgs(prismaArgs),
    );
  }

  @Get(':id')
  @ApiQuery({ name: 'args', required: false })
  async findOne(@Param('id') id: string, @Query('args') prismaArgs: string) {
    return await this.bookingService.findOne(
      id,
      this.prismaHelperService.parsePrismaArgs(prismaArgs),
    );
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateBookingDto: UpdateBookingDto,
  ) {
    return await this.bookingService.update(
      id,
      <Prisma.BookingUpdateInput>updateBookingDto,
    );
  }

  @Post(':id/cancelled')
  async cancelledBooking(@Param('id') id: string, @Request() req) {
    return await this.bookingService.cancelledBooking(id, req.user.id);
  }

  @Post('confirm/cancelled/:token')
  async consfirmCancelledBooking(@Param('token') id: string) {
    return await this.bookingService.confirmCancelledBooking(id);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return await this.bookingService.remove(id);
  }
}
