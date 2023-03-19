import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaClientValidationError } from '@prisma/client/runtime/library';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateTrainTicketDto } from './dto/create-train-ticket.dto';
import { UpdateTrainTicketDto } from './dto/update-train-ticket.dto';

@Injectable()
export class TrainTicketService {
  constructor(private readonly prismaService: PrismaService) {}

  async create(creatTrainTicketDto: Prisma.TrainTicketCreateInput) {
    try {
      return await this.prismaService.trainTicket.create({
        data: creatTrainTicketDto,
      });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientValidationError) {
        throw new BadRequestException('Error prisma');
      }
      throw error;
    }
  }

  async findAll(prismaArgs: Prisma.TrainTicketArgs = {}) {
    try {
      const trainTickets = await this.prismaService.trainTicket.findMany({
        ...prismaArgs,
      });
      return trainTickets;
    } catch (error) {
      if (error instanceof PrismaClientValidationError) {
        throw new BadRequestException(`Query argument validation faild`);
      }
      throw error;
    }
  }

  async searchTicketAvalaibleWithTrip(tripId: string) {
    try {
      const trainTickets = await this.prismaService.trainTicket.findMany({
        where: {
          seat: {
            AND: [
              {
                isAvailable: true,
              },
              {
                tripId: {
                  equals: tripId,
                },
              },
            ],
          },
        },
      });
      return trainTickets;
    } catch (error) {
      if (error instanceof PrismaClientValidationError) {
        throw new BadRequestException(`Query argument validation faild`);
      }
      throw error;
    }
  }

  async searchTicketAvailable() {
    try {
      const trainTickets = await this.prismaService.trainTicket.findMany({
        where: {
          seat: {
            isAvailable: true,
          },
        },
      });
      return trainTickets;
    } catch (error) {
      if (error instanceof PrismaClientValidationError) {
        throw new BadRequestException(`Query argument validation faild`);
      }
      throw error;
    }
  }

  async findOne(id: string, prismaArgs: Prisma.TrainTicketArgs = {}) {
    try {
      const trainTicket = await this.prismaService.trainTicket.findUnique({
        where: { id },
        ...prismaArgs,
      });
      if (!trainTicket) {
        throw new NotFoundException(`trainTicket with ref ${id} not found`);
      }
      return trainTicket;
    } catch (error) {
      if (error instanceof PrismaClientValidationError) {
        throw new BadRequestException(`Query argument validation faild`);
      }
      throw error;
    }
  }

  async update(
    id: string,
    updateTrainTicketDto: Prisma.TrainTicketUpdateInput,
  ) {
    const trainTicket = await this.findOne(id);
    try {
      const updatedTrainTicket = await this.prismaService.trainTicket.update({
        where: { id: trainTicket.id },
        data: updateTrainTicketDto,
      });
      return updatedTrainTicket;
    } catch (error) {
      throw error;
    }
  }

  async remove(id: string) {
    const trainTicket = await this.findOne(id);
    return await this.prismaService.trainTicket.delete({
      where: { id: trainTicket.id },
    });
  }
}
