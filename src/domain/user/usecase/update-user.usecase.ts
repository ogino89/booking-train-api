import { IException } from '../../../domain/ports/exceptions.interface';
import { ILogger } from '../../../domain/ports/logger.interface';
import { UserModel } from '../model/user.model';
import { UserRepositoryInterface } from '../port/user-repository.interface';

export class UpdateUserUseCase {
  constructor(
    private readonly userRepository: UserRepositoryInterface,
    private readonly logger: ILogger,
    private readonly exeption: IException,
  ) {}

  public async execute(
    id: string,
    dataUser: UserModel,
  ): Promise<UserModel | any> {
    try {
      const userCreated: UserModel | any = await this.userRepository.update(
        id,
        dataUser,
      );
      this.logger.log(
        'UpdateUser UseCases execute',
        'One User have been Updated',
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
