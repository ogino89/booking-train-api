import { ILogger } from '../../../domain/ports/logger.interface';
import { TripModel } from '../model/trip.model';
import { TripRepositoryInterface } from '../port/trip-repository.interface';
import { IException } from '../../../domain/ports/exceptions.interface';

export class CreateTripUseCase {
  constructor(
    private readonly tripRepository: TripRepositoryInterface,
    private readonly logger: ILogger,
    private readonly exeption: IException,
  ) {}

  public async execute(dataTrip: TripModel): Promise<TripModel | any> {
    try {
      const createdTrip = await this.tripRepository.create(dataTrip);
      this.logger.log(
        'CreateTrip UseCases execute',
        'New Trip have been inserted',
      );
      return createdTrip;
    } catch (error) {
      this.exeption.badRequestException({ message: 'bad request' });
    }
  }
}
