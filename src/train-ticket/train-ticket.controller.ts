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
import { TrainTicketService } from './train-ticket.service';
import { CreateTrainTicketDto } from './dto/create-train-ticket.dto';
import { UpdateTrainTicketDto } from './dto/update-train-ticket.dto';
import { ApiBearerAuth, ApiQuery, ApiTags } from '@nestjs/swagger';
import { PrismaHelperService } from 'src/helper/prisma-helper/prisma-helper.service';
import { Prisma } from '@prisma/client';
import { JwtGuard } from 'src/auth/guards/jwt.guard';

@ApiBearerAuth()
@UseGuards(JwtGuard)
@ApiTags('Train-ticket')
@Controller('train-ticket')
export class TrainTicketController {
  constructor(
    private readonly trainTicketService: TrainTicketService,
    private prismaHelperService: PrismaHelperService,
  ) {}

  @Post()
  async create(@Body() createTrainTicketDto: CreateTrainTicketDto) {
    return await this.trainTicketService.create(
      <Prisma.TrainTicketCreateInput>createTrainTicketDto,
    );
  }

  @Get()
  @ApiQuery({ name: 'args', required: false })
  async findAll(@Query('args') prismaArgs: string) {
    return await this.trainTicketService.findAll(
      this.prismaHelperService.parsePrismaArgs(prismaArgs),
    );
  }

  @Get('available')
  async searchTicketAvalaible() {
    return await this.trainTicketService.searchTicketAvailable();
  }

  @Get('available/trip/:tripId')
  async searchTicketAvalaibleWithTrip(@Param('tripId') id: string) {
    return await this.trainTicketService.searchTicketAvalaibleWithTrip(id);
  }

  @Get(':id')
  @ApiQuery({ name: 'args', required: false })
  async findOne(@Param('id') id: string, @Query('args') prismaArgs: string) {
    return await this.trainTicketService.findOne(
      id,
      this.prismaHelperService.parsePrismaArgs(prismaArgs),
    );
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateTrainTicketDto: UpdateTrainTicketDto,
  ) {
    return await this.trainTicketService.update(
      id,
      <Prisma.TrainTicketUpdateInput>updateTrainTicketDto,
    );
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return await this.trainTicketService.remove(id);
  }
}
