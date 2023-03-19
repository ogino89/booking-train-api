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
import { TripService } from './trip.service';
import { CreateTripDto } from './dto/create-trip.dto';
import { UpdateTripDto } from './dto/update-trip.dto';
import { Prisma } from '@prisma/client';
import { ApiBearerAuth, ApiQuery, ApiTags } from '@nestjs/swagger';
import { PrismaHelperService } from 'src/helper/prisma-helper/prisma-helper.service';
import { JwtGuard } from 'src/auth/guards/jwt.guard';

@ApiBearerAuth()
@UseGuards(JwtGuard)
@ApiTags('Trip')
@Controller('trip')
export class TripController {
  constructor(
    private readonly tripService: TripService,
    private prismaHelperService: PrismaHelperService,
  ) {}

  @Post()
  async create(@Body() createTripDto: CreateTripDto) {
    return await this.tripService.create(<Prisma.TripCreateInput>createTripDto);
  }

  @Get()
  @ApiQuery({ name: 'args', required: false })
  async findAll(@Query('args') prismaArgs: string) {
    return await this.tripService.findAll(
      this.prismaHelperService.parsePrismaArgs(prismaArgs),
    );
  }

  @Get('available/seats')
  async findAllWithAvailableSeats() {
    return await this.tripService.findAllWithAvailableSeats();
  }

  @Get(':id')
  @ApiQuery({ name: 'args', required: false })
  async findOne(@Param('id') id: string, @Query('args') prismaArgs: string) {
    return await this.tripService.findOne(
      id,
      this.prismaHelperService.parsePrismaArgs(prismaArgs),
    );
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateTripDto: UpdateTripDto) {
    return await this.tripService.update(
      id,
      <Prisma.TripUpdateInput>updateTripDto,
    );
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return await this.tripService.remove(id);
  }
}
