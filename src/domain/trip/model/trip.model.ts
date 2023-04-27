export class TripModel {
  id?: string;
  departure: string;
  arrival: string;

  constructor(departure: string, arrival: string, id?: string) {
    this.id = id ?? null;
    this.departure = departure;
    this.arrival = arrival;
  }
}
