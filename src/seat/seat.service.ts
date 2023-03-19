import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaClientValidationError } from '@prisma/client/runtime/library';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class SeatService {
  constructor(private readonly prismaService: PrismaService) {}

  async create(createSeatDto: Prisma.SeatCreateInput) {
    try {
      return await this.prismaService.seat.create({
        data: createSeatDto,
      });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientValidationError) {
        throw new BadRequestException('Error prisma');
      }
      throw error;
    }
  }

  async findAll(prismaArgs: Prisma.SeatArgs = {}) {
    try {
      const seats = await this.prismaService.seat.findMany({
        include: {
          trip: true,
        },
        ...prismaArgs,
      });
      return seats;
    } catch (error) {
      if (error instanceof PrismaClientValidationError) {
        throw new BadRequestException(`Query argument validation faild`);
      }
      throw error;
    }
  }

  async findOne(id: string, prismaArgs: Prisma.SeatArgs = {}) {
    try {
      const seat = await this.prismaService.seat.findUnique({
        where: { id },
        ...prismaArgs,
      });
      if (!seat) {
        throw new NotFoundException(`seat with ref ${id} not found`);
      }
      return seat;
    } catch (error) {
      if (error instanceof PrismaClientValidationError) {
        throw new BadRequestException(`Query argument validation faild`);
      }
      throw error;
    }
  }

  async update(id: string, updateSeatDto: Prisma.SeatUpdateInput) {
    const seat = await this.findOne(id);
    try {
      const updatedSeat = await this.prismaService.seat.update({
        where: { id: seat.id },
        data: updateSeatDto,
      });
      return updatedSeat;
    } catch (error) {
      throw error;
    }
  }

  async remove(id: string) {
    const seat = await this.findOne(id);
    return await this.prismaService.seat.delete({
      where: { id: seat.id },
    });
  }
}
