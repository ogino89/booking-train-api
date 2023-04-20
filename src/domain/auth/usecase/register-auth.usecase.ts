import { UserModel } from '../../../domain/user/model/user.model';
import { IException } from '../../../domain/ports/exceptions.interface';
import { ILogger } from '../../../domain/ports/logger.interface';
import { IHashingService } from '../../ports/hashing.interface';
import { AuthRepositoryInterface } from '../port/auth-repository.interface';

export class RegisterAuthUseCase {
  constructor(
    private readonly authRepository: AuthRepositoryInterface,
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
      const userCreated: UserModel | any = await this.authRepository.register(
        user,
      );
      this.logger.log(
        'RegisterAuth UseCases execute',
        'New User have been registered',
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
