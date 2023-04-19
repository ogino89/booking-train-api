import { IException } from '../../../domain/ports/exceptions.interface';
import { ILogger } from '../../../domain/ports/logger.interface';
import { UserModel } from '../model/user.model';
import { UserRepositoryInterface } from '../port/user-repository.interface';

export class FindAllUserUseCase {
  constructor(
    private readonly userRepository: UserRepositoryInterface,
    private readonly logger: ILogger,
    private readonly exeption: IException,
  ) {}

  public async execute(): Promise<UserModel[] | any> {
    try {
      const listOfUsers = await this.userRepository.findAll();
      this.logger.log(
        'FindAllUser UseCases execute',
        'List of user have been returned',
      );
      return listOfUsers;
    } catch (error) {
      this.exeption.internalServerErrorException({
        message: `Error server`,
        code_error: 500,
      });
    }
  }
}
