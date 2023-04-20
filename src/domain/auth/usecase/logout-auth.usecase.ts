import { AuthRepositoryInterface } from '../port/auth-repository.interface';

export class LogoutAuthUseCase {
  constructor(private readonly authRepository: AuthRepositoryInterface) {}

  public async execute(id: string): Promise<void> {
    this.authRepository.logout(id);
  }
}
