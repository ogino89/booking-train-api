import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Prisma } from '@prisma/client';
import { UserService } from '../user/user.service';
import { RegisterDto } from './dto/register.dto';
import * as bcrypt from 'bcrypt';
import { ConfigService } from '@nestjs/config';
import {
  AuthRepositoryInterface,
  TypeResponseGetToken,
} from '../../domain/auth/port/auth-repository.interface';
import { UserModel } from 'src/domain/user/model/user.model';

@Injectable()
export class AuthService implements AuthRepositoryInterface {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  async findByEmail(email: string): Promise<UserModel> {
    let user = await this.userService.findByEmail(email);
    return user;
  }

  async getTokens(
    userId: string,
    email: string,
  ): Promise<TypeResponseGetToken> {
    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(
        {
          sub: userId,
          email: email,
        },
        {
          secret: this.configService.get<string>('JWT_ACCESS_SECRET'),
          expiresIn: this.configService.get<string>('JWT_EXPIRATION_TIME'),
        },
      ),
      this.jwtService.signAsync(
        {
          sub: userId,
          email: email,
        },
        {
          secret: this.configService.get<string>('JWT_REFRESH_SECRET'),
          expiresIn: this.configService.get<string>(
            'JWT_REFRESH_EXPIRATION_TIME',
          ),
        },
      ),
    ]);

    return {
      accessToken,
      refreshToken,
    };
  }

  // async validateUser(email: string, password: string) {
  //   let user = await this.userService.findByEmail(email);
  //   // User not found
  //   if (!user) {
  //     throw new BadRequestException('Wrong credentials');
  //   }
  //   // Compare password
  //   const isPasswordMatching = await bcrypt.compare(password, user.password);
  //   if (!isPasswordMatching) {
  //     throw new UnauthorizedException();
  //   }
  //   delete user.password;
  //   return user;
  // }

  // async login(user: any) {
  //   const tokens = await this.getTokens(user.id, user.email);
  //   await this.updateRefreshToken(user.id, tokens.refreshToken);
  //   // const payload = { email: user.email, sub: user.id };
  //   return {
  //     access_token: tokens.accessToken,
  //     refresh_token: tokens.refreshToken,
  //   };
  // }

  // register(registerDto: RegisterDto) {
  //   return this.userService.create(<Prisma.UserCreateInput>registerDto);
  // }

  async refreshToken(refreshToken: string, userId: string) {
    const user = await this.userService.findOne(userId);
    const isRefreshTokenMatching = await bcrypt.compare(
      refreshToken,
      user.refreshToken,
    );
    if (!isRefreshTokenMatching) throw new ForbiddenException('Access Denied');
    const tokens = await this.getTokens(user.id, user.email);
    await this.updateRefreshToken(user.id, tokens.refreshToken);

    return {
      access_token: tokens.accessToken,
      refresh_token: tokens.refreshToken,
    };
  }

  async logout(userId: string) {
    return this.userService.update(userId, {
      refreshToken: null,
      name: '',
      email: '',
      password: '',
    });
  }

  async hashData(data: string) {
    return await bcrypt.hash(data, await bcrypt.genSalt(10));
  }

  async updateRefreshToken(userId: string, refreshToken: string) {
    const hashedRefreshToken = await this.hashData(refreshToken);
    await this.userService.update(userId, {
      refreshToken: hashedRefreshToken,
      name: '',
      email: '',
      password: '',
    });
  }
}
