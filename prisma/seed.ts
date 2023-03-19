import { seedDefaultTrips } from './seeds/trip.seed';

async function main() {
  console.log('Start database seeding...');
  await seedDefaultTrips();
}

main();
