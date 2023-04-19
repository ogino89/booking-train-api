import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { LocalStrategy } from './strategies/local.strategy';
import { UserModule } from '../user/user.module';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { JwtStrategy } from './strategies/jwt.strategy';
import { PrismaModule } from '../prisma/prisma.module';
import { RefreshTokenStrategy } from './strategies/refreshToken.strategy';
import { BcryptService } from '../adapters/bcrypt/bcrypt.service';
import { ExceptionsService } from '../adapters/exceptions/exceptions.service';
import { LoggerService } from '../adapters/logger/logger.service';
// import { LoginAuthUseCase } from 'src/domain/auth/usecase/login-auth.usecase';

@Module({
  imports: [
    UserModule,
    PrismaModule,
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => {
        return {
          secret: configService.get('JWT_SECRET'),
          signOptions: {
            expiresIn: `${configService.get('JWT_EXPIRATION_TIME')}s`,
          },
        };
      },
    }),
    // BcryptService,
    // ExceptionsService,
    // LoggerService,
    // LoginAuthUseCase,
  ],
  providers: [AuthService, LocalStrategy, JwtStrategy, RefreshTokenStrategy],
  controllers: [AuthController],
})
export class AuthModule {}
