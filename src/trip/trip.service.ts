import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaClientValidationError } from '@prisma/client/runtime/library';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class TripService {
  constructor(private readonly prismaService: PrismaService) {}

  async create(createTriptDto: Prisma.TripCreateInput) {
    try {
      return await this.prismaService.trip.create({
        data: createTriptDto,
      });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientValidationError) {
        throw new BadRequestException('Error prisma');
      }
      throw error;
    }
  }

  async findAll(prismaArgs: Prisma.TripArgs = {}) {
    try {
      const trips = await this.prismaService.trip.findMany({
        ...prismaArgs,
      });
      return trips;
    } catch (error) {
      if (error instanceof PrismaClientValidationError) {
        throw new BadRequestException(`Query argument validation faild`);
      }
      throw error;
    }
  }

  async findAllWithAvailableSeats() {
    try {
      const trips = await this.prismaService.trip.findMany({
        include: {
          seats: {
            where: {
              isAvailable: true,
            },
          },
        },
      });
      return trips;
    } catch (error) {
      if (error instanceof PrismaClientValidationError) {
        throw new BadRequestException(`Query argument validation faild`);
      }
      throw error;
    }
  }

  async findOne(id: string, prismaArgs: Prisma.TripArgs = {}) {
    try {
      const trip = await this.prismaService.trip.findUnique({
        where: { id },
        ...prismaArgs,
      });
      if (!trip) {
        throw new NotFoundException(`Trip with ref ${id} not found`);
      }
      return trip;
    } catch (error) {
      if (error instanceof PrismaClientValidationError) {
        throw new BadRequestException(`Query argument validation faild`);
      }
      throw error;
    }
  }

  async update(id: string, updateTripDto: Prisma.TripUpdateInput) {
    const trip = await this.findOne(id);
    try {
      const updatedSeat = await this.prismaService.trip.update({
        where: { id: trip.id },
        data: updateTripDto,
      });
      return updatedSeat;
    } catch (error) {
      throw error;
    }
  }

  async remove(id: string) {
    const trip = await this.findOne(id);
    return await this.prismaService.trip.delete({
      where: { id: trip.id },
    });
  }
}
