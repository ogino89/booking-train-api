import { ILogger } from 'src/domain/ports/logger.interface';
import { TripRepositoryInterface } from '../port/trip-repository.interface';
import { IException } from 'src/domain/ports/exceptions.interface';
import { TripModel } from '../model/trip.model';

export class FindAllTripUseCase {
  constructor(
    private readonly tripRepository: TripRepositoryInterface,
    private readonly logger: ILogger,
    private readonly exeption: IException,
  ) {}

  public async execute(): Promise<TripModel[] | any> {
    try {
      const listOfTrips = await this.tripRepository.findAll();
      this.logger.log(
        'FindAllTrip UseCases execute',
        'List of trip have been returned',
      );
      return listOfTrips;
    } catch (error) {
      this.exeption.internalServerErrorException({
        message: `Error server`,
        code_error: 500,
      });
    }
  }
}
