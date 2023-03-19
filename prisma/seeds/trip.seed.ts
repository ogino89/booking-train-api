import { PrismaClient } from '@prisma/client';

const defaultTrips = [
  {
    departure: 'Depart A',
    arrival: 'Arrivée A',
  },
  {
    departure: 'Depart B',
    arrival: 'Arrivée B',
  },
  {
    departure: 'Depart C',
    arrival: 'Arrivée C',
  },
  {
    departure: 'Depart D',
    arrival: 'Arrivée D',
  },
];

const defaultSeats = [
  {
    seatNo: 1,
    isAvailable: true,
    ticket: {
      date: new Date().toISOString(),
      price: 100,
    },
  },
  {
    seatNo: 2,
    isAvailable: true,
    ticket: {
      date: new Date().toISOString(),
      price: 80,
    },
  },
  {
    seatNo: 3,
    isAvailable: true,
    ticket: {
      date: new Date().toISOString(),
      price: 60,
    },
  },
  {
    seatNo: 4,
    isAvailable: true,
    ticket: {
      date: new Date().toISOString(),
      price: 40,
    },
  },
  {
    seatNo: 5,
    isAvailable: true,
    ticket: {
      date: new Date().toISOString(),
      price: 20,
    },
  },
];

export const seedDefaultTrips = async () => {
  const prisma = new PrismaClient();
  await Promise.all(
    defaultTrips.map(async (item) => {
      const trip = await prisma.trip.findFirst({
        where: {
          AND: [
            {
              departure: item.departure,
            },
            {
              arrival: item.arrival,
            },
          ],
        },
      });
      if (trip) {
        console.info(
          `trip ${trip.departure} -> ${trip.arrival} alredy exist with id ${trip.id}`,
        );
        return;
      }
      try {
        console.info(
          `Creating trip with name ${(item.departure, item.arrival)}...`,
        );
        const createdtrip = await prisma.trip.create({ data: item });
        if (createdtrip) {
          console.info(
            `trip ${createdtrip.departure} ${createdtrip.arrival} created... ok`,
          );
          await Promise.all(
            defaultSeats.map(async (seats) => {
              await prisma.seat.create({
                data: {
                  seatNo: seats.seatNo,
                  isAvailable: seats.isAvailable,
                  tripId: createdtrip.id,
                  trainTicket: {
                    create: {
                      price: seats.ticket.price,
                      date: seats.ticket.date,
                    },
                  },
                },
              });
            }),
          );
        }
      } catch (error) {
        console.log(error);
      }
    }),
  );
  return true;
};
