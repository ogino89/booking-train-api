import { IException } from '../../../domain/ports/exceptions.interface';
import { ILogger } from '../../../domain/ports/logger.interface';
import { UserModel } from '../model/user.model';
import { UserRepositoryInterface } from '../port/user-repository.interface';

export class FindByEmailUserUseCase {
  constructor(
    private readonly userRepository: UserRepositoryInterface,
    private readonly logger: ILogger,
    private readonly exeption: IException,
  ) {}

  public async execute(email: string): Promise<UserModel | any> {
    try {
      const userCreated: UserModel | any =
        await this.userRepository.findByEmail(email);
      this.logger.log(
        'FindUserByEmail UseCases execute',
        'One User have been find',
      );
      return {
        id: userCreated.id,
        name: userCreated.name,
        email: userCreated.email,
      };
    } catch (error) {
      this.exeption.notFoundException({
        message: `User with email ${email} not found`,
        code_error: 404,
      });
    }
  }
}
