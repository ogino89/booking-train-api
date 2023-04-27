import { UserModel } from '../../../domain/user/model/user.model';
import { AuthRepositoryInterface } from '../port/auth-repository.interface';
export class LoginAuthUseCase {
  constructor(private readonly authRepository: AuthRepositoryInterface) {}

  public async execute(id: string, email: string): Promise<UserModel | any> {
    const tokens = await this.authRepository.getTokens(id, email);
    this.authRepository.updateRefreshToken(id, email, tokens.refreshToken);

    return {
      access_token: tokens.accessToken,
      refresh_token: tokens.refreshToken,
    };
  }
}
