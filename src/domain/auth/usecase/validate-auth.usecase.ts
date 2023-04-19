import { ILogger } from '../../../domain/ports/logger.interface';
import { IHashingService } from '../../../domain/ports/hashing.interface';
import { IException } from '../../../domain/ports/exceptions.interface';
import { UserModel } from '../../../domain/user/model/user.model';
import { AuthRepositoryInterface } from '../port/auth-repository.interface';

export class ValidateAuthUseCase {
  constructor(
    private readonly authRepository: AuthRepositoryInterface,
    private readonly hashing: IHashingService,
    private readonly logger: ILogger,
    private readonly exeption: IException,
  ) {}

  public async execute(
    email: string,
    password: string,
  ): Promise<UserModel | any> {
    const user: UserModel | any = await this.authRepository.findByEmail(email);
    if (!user) {
      this.exeption.badRequestException({
        message: 'Wrong credentials',
      });
    }
    this.logger.log('ValidateAuth UseCases execute', 'User have been find');
    const isPasswordMatching = await this.hashing.compare(
      password,
      user.password,
    );

    if (!isPasswordMatching) {
      this.exeption.unauthorizedException();
    }

    return user;
  }
}
