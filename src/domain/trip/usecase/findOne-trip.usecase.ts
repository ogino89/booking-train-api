import { ILogger } from 'src/domain/ports/logger.interface';
import { TripRepositoryInterface } from '../port/trip-repository.interface';
import { IException } from 'src/domain/ports/exceptions.interface';
import { TripModel } from '../model/trip.model';

export class FindOneTripUseCase {
  constructor(
    private readonly tripRepository: TripRepositoryInterface,
    private readonly logger: ILogger,
    private readonly exeption: IException,
  ) {}

  public async execute(id: string): Promise<TripModel | any> {
    try {
      const trip: TripModel | any = await this.tripRepository.findOne(id);
      this.logger.log(
        'FindOneTrip UseCases execute',
        'One Trip have been find',
      );
      return trip;
    } catch (error) {
      this.exeption.notFoundException({
        message: `Trip with id ${id} not found`,
        code_error: 404,
      });
    }
  }
}
