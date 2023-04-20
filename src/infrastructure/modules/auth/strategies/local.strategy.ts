import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthService } from '../auth.service';
import { BcryptService } from 'src/infrastructure/adapters/bcrypt/bcrypt.service';
import { LoggerService } from 'src/infrastructure/adapters/logger/logger.service';
import { ExceptionsService } from 'src/infrastructure/adapters/exceptions/exceptions.service';
import { ValidateAuthUseCase } from '../../../../domain/auth/usecase/validate-auth.usecase';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly authService: AuthService,
    private readonly hashingService: BcryptService,
    private readonly loggerService: LoggerService,
    private readonly exceptionService: ExceptionsService,
  ) {
    super({ usernameField: 'email' });
  }

  async validate(username: string, password: string): Promise<any> {
    const validateUserUseCase = new ValidateAuthUseCase(
      this.authService,
      this.hashingService,
      this.loggerService,
      this.exceptionService,
    );

    const user = await validateUserUseCase.execute(username, password);

    return user;
  }
}
