import { IException } from '../../../domain/ports/exceptions.interface';
import { ILogger } from '../../../domain/ports/logger.interface';
import { IHashingService } from '../../ports/hashing.interface';
import { UserModel } from '../model/user.model';
import { UserRepositoryInterface } from '../port/user-repository.interface';

export class CreateUserUseCase {
  constructor(
    private readonly userRepository: UserRepositoryInterface,
    private readonly hashing: IHashingService,
    private readonly logger: ILogger,
    private readonly exeption: IException,
  ) {}

  public async execute(dataUser: UserModel): Promise<UserModel | any> {
    try {
      let hasedPassword = await this.hashing.hash(dataUser.password);
      const user = new UserModel(
        dataUser.name,
        dataUser.email,
        hasedPassword,
        dataUser.refreshToken,
      );
      const userCreated: UserModel | any = await this.userRepository.create(
        user,
      );
      this.logger.log(
        'CreateUser UseCases execute',
        'New User have been inserted',
      );
      return {
        id: userCreated?.id,
        email: dataUser.email,
        name: dataUser.name,
      };
    } catch (error) {
      if (error.code === 'P2002') {
        this.exeption.conflictException({
          message: 'Email already exist',
          code_error: 409,
        });
      } else {
        throw error;
      }
    }
  }
}
