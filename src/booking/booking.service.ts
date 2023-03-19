import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaClientValidationError } from '@prisma/client/runtime/library';
import { PrismaService } from 'src/prisma/prisma.service';
import { SeatService } from 'src/seat/seat.service';
import { SendMailService } from 'src/send-mail/send-mail.service';
import { CreateTrainTicketDto } from 'src/train-ticket/dto/create-train-ticket.dto';
import { v4 as uuidv4 } from 'uuid';
import { CreateBookingWithTicketDto } from './dto/create-booking-with-ticket.dto';

@Injectable()
export class BookingService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly seatService: SeatService,
    private readonly sendMailService: SendMailService,
  ) {}

  async createWithTicket(
    userId: string,
    createTrainTicket: CreateBookingWithTicketDto,
  ) {
    try {
      await Promise.all(
        createTrainTicket.tickets.map(async (tiket) => {
          const seat = await this.seatService.findOne(tiket.seatId);
          if (!seat.isAvailable) {
            throw new ConflictException('Seat is not available');
          }
        }),
      );

      const booking = await this.prismaService.booking.create({
        data: {
          userId: userId,
          trainTickets: {
            connect: createTrainTicket.tickets,
          },
        },
        include: {
          trainTickets: {
            select: {
              price: true,
              seat: {
                select: {
                  seatNo: true,
                  trip: {
                    select: {
                      departure: true,
                      arrival: true,
                    },
                  },
                },
              },
            },
          },
          user: {
            select: {
              name: true,
              email: true,
            },
          },
        },
      });

      const uuidGenerate = uuidv4();
      await this.prismaService.confirmBooking.create({
        data: {
          bookingId: booking.id,
          uuid: uuidGenerate,
          useId: userId,
        },
      });

      await this.sendMailService.sendMailToConfirmBooking(
        booking,
        uuidGenerate,
      );

      return { msg: 'Check your E-mail for vaidate booking' };
    } catch (error) {
      throw error;
    }
  }

  async cancelledBooking(id: string, userId: string) {
    try {
      const booking = await this.findOne(id, {
        include: {
          trainTickets: {
            select: {
              price: true,
              seat: {
                select: {
                  seatNo: true,
                  trip: {
                    select: {
                      departure: true,
                      arrival: true,
                    },
                  },
                },
              },
            },
          },
          user: {
            select: {
              name: true,
              email: true,
            },
          },
        },
      });

      if (booking.status == 'CANCELLED') {
        throw new ConflictException('Booking is already cancelled');
      }

      const uuidGenerate = uuidv4();
      await this.prismaService.cancelBooking.create({
        data: {
          bookingId: booking.id,
          uuid: uuidGenerate,
          useId: userId,
        },
      });

      await this.sendMailService.sendMailToCancelledBooking(
        booking,
        uuidGenerate,
      );

      return {
        msg: 'Check your E-mail for canceled booking',
      };
    } catch (error) {
      throw error;
    }
  }

  async confirmBooking(uuid: string) {
    try {
      let booking;
      const uuidInfo = await this.findOneUuidConfirm(uuid);
      booking = await this.findOne(uuidInfo.bookingId, {
        include: {
          trainTickets: true,
        },
      });
      const updateBooking = await this.update(booking.id, {
        status: 'VALIDATE',
      });

      if (booking.trainTickets.length > 0) {
        Promise.all(
          booking.trainTickets.map(async (tiket: CreateTrainTicketDto) => {
            await this.seatService.update(tiket.seatId, { isAvailable: false });
          }),
        );
      }
      return updateBooking;
    } catch (error) {
      throw error;
    }
  }

  async confirmCancelledBooking(uuid: string) {
    try {
      let booking;
      const uuidInfo = await this.findOneUuidCancel(uuid);
      booking = await this.findOne(uuidInfo.bookingId, {
        include: {
          trainTickets: true,
        },
      });
      const updateBooking = await this.update(booking.id, {
        status: 'CANCELLED',
      });
      if (booking.trainTickets.length > 0) {
        Promise.all(
          booking.trainTickets.map(
            async (ticket: Prisma.TrainTicketCreateManyInput) => {
              await this.seatService.update(ticket.seatId, {
                isAvailable: true,
              });
              await this.prismaService.trainTicket.update({
                where: {
                  id: ticket.id,
                },
                data: {
                  booking: {
                    disconnect: true,
                  },
                },
              });
            },
          ),
        );
      }
      return updateBooking;
    } catch (error) {
      throw error;
    }
    // const updatedBooking = await this.prismaService.booking.update({
    //   where: { id: booking.id },
    //   data: {
    //     status: 'CANCELLED',
    //   },
    //   include: {
    //     trainTickets: true,
    //   },
    // });

    // if (updatedBooking.trainTickets.length > 0) {
    //   Promise.all(
    //     updatedBooking.trainTickets.map(async (ticket) => {
    //       await this.prismaService.seat.update({
    //         where: {
    //           id: ticket.seatId,
    //         },
    //         data: {
    //           isAvailable: true,
    //         },
    //       });

    //       await this.prismaService.trainTicket.update({
    //         where: {
    //           id: ticket.id,
    //         },
    //         data: {
    //           booking: {
    //             disconnect: true,
    //           },
    //         },
    //       });
    //     }),
    //   );
    // }
  }

  async findAll(prismaArgs: Prisma.BookingArgs = {}) {
    try {
      const bookings = await this.prismaService.booking.findMany({
        ...prismaArgs,
      });
      return bookings;
    } catch (error) {
      if (error instanceof PrismaClientValidationError) {
        throw new BadRequestException(`Query argument validation faild`);
      }
      throw error;
    }
  }

  async findOneUuidConfirm(id: string) {
    try {
      const token = await this.prismaService.confirmBooking.findFirst({
        where: { uuid: id },
      });
      if (!token) {
        throw new NotFoundException(
          `Token confirmation with ref ${id} not found`,
        );
      }
      return token;
    } catch (error) {
      if (error instanceof PrismaClientValidationError) {
        throw new BadRequestException(`Query argument validation faild`);
      }
      throw error;
    }
  }

  async findOneUuidCancel(id: string) {
    try {
      const token = await this.prismaService.cancelBooking.findFirst({
        where: { uuid: id },
      });
      if (!token) {
        throw new NotFoundException(`Token cancelled with ref ${id} not found`);
      }
      return token;
    } catch (error) {
      if (error instanceof PrismaClientValidationError) {
        throw new BadRequestException(`Query argument validation faild`);
      }
      throw error;
    }
  }

  async findOne(id: string, prismaArgs: Prisma.BookingArgs = {}) {
    try {
      const booking = await this.prismaService.booking.findUnique({
        where: { id },
        ...prismaArgs,
      });
      if (!booking) {
        throw new NotFoundException(`booking with ref ${id} not found`);
      }
      return booking;
    } catch (error) {
      if (error instanceof PrismaClientValidationError) {
        throw new BadRequestException(`Query argument validation faild`);
      }
      throw error;
    }
  }

  async update(id: string, updateBookingDto: Prisma.BookingUpdateInput) {
    const booking = await this.findOne(id);
    try {
      const updatedBooking = await this.prismaService.booking.update({
        where: { id: booking.id },
        data: updateBookingDto,
      });
      return updatedBooking;
    } catch (error) {
      throw error;
    }
  }

  async remove(id: string) {
    const booking = await this.findOne(id);
    return await this.prismaService.booking.delete({
      where: { id: booking.id },
    });
  }
}
