import { TripModel } from '../model/trip.model';

export interface TripRepositoryInterface {
  create(trip: TripModel): Promise<TripModel | unknown>;
  findAll(): Promise<TripModel[] | unknown>;
  findAllWithAvailableSeats(): Promise<TripModel[] | unknown>;
  findOne(id: string): Promise<TripModel | unknown>;
  update(id: string, trip: TripModel): Promise<TripModel | unknown>;
  delete(id: string): Promise<string>;
}
