import { IException } from '../../../domain/ports/exceptions.interface';
import { ILogger } from '../../../domain/ports/logger.interface';
import { UserModel } from '../model/user.model';
import { UserRepositoryInterface } from '../port/user-repository.interface';

export class DeleteUserUseCase {
  constructor(
    private readonly userRepository: UserRepositoryInterface,
    private readonly logger: ILogger,
    private readonly exeption: IException,
  ) {}

  public async execute(id: string): Promise<string> {
    try {
      const message = await this.userRepository.delete(id);
      this.logger.log('DeleteUser UseCases execute', 'User have been deleted');
      return message;
    } catch (error) {
      this.exeption.notFoundException({
        message: `User with id ${id} not found`,
        code_error: 404,
      });
    }
  }
}
