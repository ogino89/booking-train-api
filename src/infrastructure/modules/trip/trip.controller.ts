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
import { JwtGuard } from '../auth/guards/jwt.guard';
import { BcryptService } from 'src/infrastructure/adapters/bcrypt/bcrypt.service';
import { LoggerService } from 'src/infrastructure/adapters/logger/logger.service';
import { ExceptionsService } from 'src/infrastructure/adapters/exceptions/exceptions.service';
import { CreateTripUseCase } from 'src/domain/trip/usecase/create-trip.usecase';
import { FindAllTripUseCase } from 'src/domain/trip/usecase/findAll-trip.usecase';
import { FindAllTripWithAvailableSeatsUseCase } from 'src/domain/trip/usecase/findAll-trip-withAvailableSeats.usecase';
import { FindOneTripUseCase } from 'src/domain/trip/usecase/findOne-trip.usecase';
import { UpdateTripUseCase } from 'src/domain/trip/usecase/update-trip.usecase';
import { DeleteTripUseCase } from 'src/domain/trip/usecase/delete-trip.usecase';

@ApiBearerAuth()
@UseGuards(JwtGuard)
@ApiTags('Trip')
@Controller('trip')
export class TripController {
  constructor(
    private readonly tripService: TripService,
    private readonly loggerService: LoggerService,
    private readonly exceptionService: ExceptionsService,
  ) {}

  @Post()
  async create(@Body() createTripDto: CreateTripDto) {
    const createTripUsecase = new CreateTripUseCase(
      this.tripService,
      this.loggerService,
      this.exceptionService,
    );
    const createdUser = await createTripUsecase.execute(createTripDto);
    return createdUser;
  }

  @Get()
  @ApiQuery({ name: 'args', required: false })
  async findAll(@Query('args') prismaArgs: string) {
    const findAllUserUseCase = new FindAllTripUseCase(
      this.tripService,
      this.loggerService,
      this.exceptionService,
    );
    return await findAllUserUseCase.execute();
  }

  @Get('available/seats')
  async findAllWithAvailableSeats() {
    const findAllWithAvailableSeatsUseCase =
      new FindAllTripWithAvailableSeatsUseCase(
        this.tripService,
        this.loggerService,
        this.exceptionService,
      );
    return await findAllWithAvailableSeatsUseCase.execute();
  }

  @Get(':id')
  @ApiQuery({ name: 'args', required: false })
  async findOne(@Param('id') id: string, @Query('args') prismaArgs: string) {
    const findOneUseCase = new FindOneTripUseCase(
      this.tripService,
      this.loggerService,
      this.exceptionService,
    );
    return await findOneUseCase.execute(id);
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateTripDto: UpdateTripDto) {
    const updateTripUseCase = new UpdateTripUseCase(
      this.tripService,
      this.loggerService,
      this.exceptionService,
    );
    return await updateTripUseCase.execute(id, updateTripDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    const deleteTripUseCase = new DeleteTripUseCase(
      this.tripService,
      this.loggerService,
      this.exceptionService,
    );
    return await deleteTripUseCase.execute(id);
  }
}
