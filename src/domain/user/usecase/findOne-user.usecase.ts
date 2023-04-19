import { IException } from '../../../domain/ports/exceptions.interface';
import { ILogger } from '../../../domain/ports/logger.interface';
import { UserModel } from '../model/user.model';
import { UserRepositoryInterface } from '../port/user-repository.interface';

export class FindOneUserUseCase {
  constructor(
    private readonly userRepository: UserRepositoryInterface,
    private readonly logger: ILogger,
    private readonly exeption: IException,
  ) {}

  public async execute(id: string): Promise<UserModel | any> {
    try {
      const userCreated: UserModel | any = await this.userRepository.findOne(
        id,
      );
      this.logger.log(
        'FindOneUser UseCases execute',
        'One User have been find',
      );
      return {
        id: userCreated.id,
        name: userCreated.name,
        email: userCreated.email,
      };
    } catch (error) {
      this.exeption.notFoundException({
        message: `User with id ${id} not found`,
        code_error: 404,
      });
    }
  }
}
