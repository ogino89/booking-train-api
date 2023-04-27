import { UserModel } from '../../../domain/user/model/user.model';
import { IHashingService } from '../../../domain/ports/hashing.interface';
import { AuthRepositoryInterface } from '../port/auth-repository.interface';
import { IException } from '../../../domain/ports/exceptions.interface';

export class RefreshAuthUseCase {
  constructor(
    private readonly authRepository: AuthRepositoryInterface,
    private readonly hashing: IHashingService,
    private readonly exeption: IException,
  ) {}

  public async execute(id: string, refreshToken: string): Promise<UserModel> {
    const user: UserModel | any = await this.authRepository.findOne(id);
    const isRefreshTokenMatching = await this.hashing.compare(
      refreshToken,
      user.refreshToken,
    );
    if (!isRefreshTokenMatching) {
      this.exeption.forbiddenException({ message: 'Access Denied' });
    }
    const tokens = await this.authRepository.getTokens(user.id, user.email);
    this.authRepository.updateRefreshToken(
      user.id,
      user.email,
      tokens.refreshToken,
    );
    return user;
  }
}
