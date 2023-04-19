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
import { LoginAuthUseCase } from '../../domain/auth/usecase/login-auth.usecase';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private userService: UserService,
  ) {}

  @Post('/login')
  @UseGuards(LocalAuthGuard)
  async login(@Request() req, @Body() loginDto: LoginDto) {
    const loginUseCase = new LoginAuthUseCase(this.authService);
    return await loginUseCase.execute(loginDto.)
    // return this.authService.login(req.user);
  }

  // @Post('/register')
  // async register(@Body() registerDto: RegisterDto) {
  //   let user = await this.authService.register(registerDto);
  //   let tooken = await this.authService.login(user);
  //   let response = { ...user, ...tooken };
  //   return response;
  // }

  @ApiBearerAuth()
  @UseGuards(JwtRefreshGuard)
  @Get('/refresh')
  async refresh(@Request() req) {
    return await this.authService.refreshToken(
      req.user.refreshToken,
      req.user.sub,
    );
  }

  @ApiBearerAuth()
  @UseGuards(JwtGuard)
  @Get('logout')
  logout(@Request() req) {
    this.authService.logout(req.user.id);
  }

  @ApiBearerAuth()
  @Get('/user')
  @UseGuards(JwtGuard)
  async user(@Request() req) {
    let user = await this.userService.findOne(req.user.id);
    delete user.password;
    return user;
  }
}
