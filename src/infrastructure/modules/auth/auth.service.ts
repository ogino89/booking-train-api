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
} from '../../../domain/auth/port/auth-repository.interface';
import { UserModel } from 'src/domain/user/model/user.model';
import { PrismaService } from '../../adapters/prisma/prisma.service';

@Injectable()
export class AuthService implements AuthRepositoryInterface {
  constructor(
    private prismaService: PrismaService,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  async findByEmail(email: string): Promise<UserModel> {
    const user = await this.prismaService.user.findFirst({
      where: { email },
    });
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
  async hashData(data: string) {
    return await bcrypt.hash(data, await bcrypt.genSalt(10));
  }

  async updateRefreshToken(id: string, refreshToken: string): Promise<void> {
    const hashedRefreshToken = await this.hashData(refreshToken);
    await this.prismaService.user.update({
      where: { id },
      data: {
        refreshToken: hashedRefreshToken,
      },
    });
  }

  async register(dataUser: UserModel): Promise<UserModel> {
    let createdUser = await this.prismaService.user.create({
      data: {
        name: dataUser.name,
        email: dataUser.email,
        password: dataUser.password,
      },
      select: {
        id: true,
        name: true,
        email: true,
        refreshToken: false,
      },
    });
    return {
      id: createdUser.id,
      name: createdUser.name,
      email: createdUser.email,
      password: dataUser.password,
    };
  }

  async findOne(id: string): Promise<UserModel> {
    const user = await this.prismaService.user.findUnique({
      where: { id },
    });
    return user;
  }

  async logout(id: string) {
    await this.prismaService.user.update({
      where: { id },
      data: {
        refreshToken: null,
      },
    });
  }
}
