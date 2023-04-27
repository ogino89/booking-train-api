import { ILogger } from 'src/domain/ports/logger.interface';
import { TripRepositoryInterface } from '../port/trip-repository.interface';
import { IException } from 'src/domain/ports/exceptions.interface';
import { TripModel } from '../model/trip.model';

export class UpdateTripUseCase {
  constructor(
    private readonly tripRepository: TripRepositoryInterface,
    private readonly logger: ILogger,
    private readonly exeption: IException,
  ) {}

  public async execute(
    id: string,
    dataTrip: TripModel | any,
  ): Promise<TripModel | any> {
    try {
      const tripUpdated: TripModel | any = await this.tripRepository.update(
        id,
        dataTrip,
      );
      this.logger.log(
        'UpdateTrip UseCases execute',
        'One Trip have been Updated',
      );
      return tripUpdated;
    } catch (error) {
      this.exeption.notFoundException({
        message: `Trip with id ${id} not found`,
        code_error: 404,
      });
    }
  }
}
