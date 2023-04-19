import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import {
  PrismaClientKnownRequestError,
  PrismaClientValidationError,
} from '@prisma/client/runtime/library';
import { CreateUserUseCase } from '../../domain/user/usecase/create-user.usecase';
import { UserRepositoryInterface } from '../../domain/user/port/user-repository.interface';
import { UserModel } from 'src/domain/user/model/user.model';
import { CreateUserDto } from './dto/create-user.dto';

@Injectable()
export class UserService implements UserRepositoryInterface {
  constructor(private prismaService: PrismaService) {}

  async create(dataUser: UserModel): Promise<UserModel> {
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

  async findAll(): Promise<UserModel[] | any> {
    const users = await this.prismaService.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
      },
    });
    return users;
  }

  async findOne(id: string): Promise<UserModel> {
    const user = await this.prismaService.user.findUnique({
      where: { id },
    });
    return user;
  }

  async update(id: string, updateUserDto: UserModel): Promise<UserModel | any> {
    return this.prismaService.user.update({
      where: { id },
      data: updateUserDto,
    });
  }

  async findByEmail(email: string): Promise<UserModel | any> {
    const user = this.prismaService.user.findFirst({
      where: { email },
    });
    return user;
  }

  async delete(id: string): Promise<string> {
    await this.prismaService.user.delete({ where: { id } });
    return `User with id ${id} is deleted`;
  }

  // async delete(id: string) {
  //   const user = await this.findOne(id);
  //   return this.prismaService.user.delete({ where: { id: user.id } });
  // }
}
