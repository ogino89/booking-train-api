import {
  Body,
  Controller,
  Get,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { UserService } from '../user/user.service';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { JwtGuard } from './guards/jwt.guard';
import { JwtRefreshGuard } from './guards/jwt-refresh.guard';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { LoginAuthUseCase } from '../../../domain/auth/usecase/login-auth.usecase';
import { RegisterAuthUseCase } from 'src/domain/auth/usecase/register-auth.usecase';
import { BcryptService } from '../../adapters/bcrypt/bcrypt.service';
import { LoggerService } from '../../adapters/logger/logger.service';
import { ExceptionsService } from '../../adapters/exceptions/exceptions.service';
import { RefreshAuthUseCase } from 'src/domain/auth/usecase/refresh-auth.usecase';
import { LogoutAuthUseCase } from 'src/domain/auth/usecase/logout-auth.usecase';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly hashingService: BcryptService,
    private readonly loggerService: LoggerService,
    private readonly exceptionService: ExceptionsService,
  ) {}

  @Post('/login')
  @UseGuards(LocalAuthGuard)
  async login(@Request() req, @Body() loginDto: LoginDto) {
    const loginUseCase = new LoginAuthUseCase(this.authService);
    return await loginUseCase.execute(req.user.sub, req.user.email);
  }

  @Post('/register')
  async register(@Body() registerDto: RegisterDto) {
    const registerUseCase = new RegisterAuthUseCase(
      this.authService,
      this.hashingService,
      this.loggerService,
      this.exceptionService,
    );
    return await registerUseCase.execute({
      name: registerDto.name,
      email: registerDto.email,
      password: registerDto.password,
    });
  }

  @ApiBearerAuth()
  @UseGuards(JwtRefreshGuard)
  @Get('/refresh')
  async refresh(@Request() req) {
    const refreshUseCase = new RefreshAuthUseCase(
      this.authService,
      this.hashingService,
      this.exceptionService,
    );

    return await refreshUseCase.execute(req.user.sub, req.user.refreshToken);
  }

  @ApiBearerAuth()
  @UseGuards(JwtGuard)
  @Get('logout')
  async logout(@Request() req) {
    const logoutUseCase = new LogoutAuthUseCase(this.authService);
    logoutUseCase.execute(req.user.id);
  }

  // @ApiBearerAuth()
  // @Get('/user')
  // @UseGuards(JwtGuard)
  // async user(@Request() req) {
  //   let user = await this.userService.findOne(req.user.id);
  //   delete user.password;
  //   return user;
  // }
}
