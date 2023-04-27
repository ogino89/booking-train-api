import { ILogger } from 'src/domain/ports/logger.interface';
import { TripRepositoryInterface } from '../port/trip-repository.interface';
import { IException } from 'src/domain/ports/exceptions.interface';

export class DeleteTripUseCase {
  constructor(
    private readonly tripRepository: TripRepositoryInterface,
    private readonly logger: ILogger,
    private readonly exeption: IException,
  ) {}

  public async execute(id: string): Promise<string> {
    try {
      const message = await this.tripRepository.delete(id);
      this.logger.log('DeleteTrip UseCases execute', 'Trip have been deleted');
      return message;
    } catch (error) {
      this.exeption.notFoundException({
        message: `Trip with id ${id} not found`,
        code_error: 404,
      });
    }
  }
}
