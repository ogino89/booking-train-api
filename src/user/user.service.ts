import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import {
  PrismaClientKnownRequestError,
  PrismaClientValidationError,
} from '@prisma/client/runtime/library';

@Injectable()
export class UserService {
  constructor(private prismaService: PrismaService) {}

  async create(createUserDto: Prisma.UserCreateInput) {
    try {
      let hasedPassword = await bcrypt.hash(
        createUserDto.password,
        await bcrypt.genSalt(10),
      );
      createUserDto.password = hasedPassword;
      let createdUser = await this.prismaService.user.create({
        data: createUserDto,
        select: {
          id: true,
          name: true,
          email: true,
          refreshToken: false,
        },
      });
      return createdUser;
    } catch (error) {
      // Handle contrainst error
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          throw new ConflictException('Email already exist');
        } else {
          throw error;
        }
      }
      // Handle validation error
      if (error instanceof Prisma.PrismaClientValidationError) {
        throw new BadRequestException('Error prisma');
      }
      throw error;
    }
  }

  async findAll(prismaArgs: Prisma.UserArgs = {}) {
    try {
      const users = await this.prismaService.user.findMany({
        select: {
          id: true,
          name: true,
          email: true,
        },
        ...prismaArgs,
      });
      return users;
    } catch (error) {
      if (error instanceof PrismaClientValidationError) {
        throw new BadRequestException(`Query argument validation faild`);
      }
      throw error;
    }
  }

  async findOne(id: string, prismaArgs: Prisma.UserArgs = {}) {
    try {
      const user = await this.prismaService.user.findUnique({
        where: { id },
        ...prismaArgs,
      });
      if (!user) {
        throw new NotFoundException(`User with id ${id} not found`);
      }
      return user;
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        // id is not a valid objectId
        if (error.code == 'P2023') {
          throw new BadRequestException(
            `Provided hex string ${id} representation must be exactly 12 bytes`,
          );
        }
        throw error;
      }
      if (error instanceof PrismaClientValidationError) {
        throw new BadRequestException(`Query argument validation faild`);
      }
      throw error;
    }
  }

  async update(id: string, updateUserDto: any) {
    const user = await this.findOne(id);
    try {
      const updatedUser = await this.prismaService.user.update({
        where: { id: user.id },
        data: updateUserDto,
      });
      return updatedUser;
    } catch (error) {
      throw error;
    }
  }

  async remove(id: string) {
    const user = await this.findOne(id);
    return this.prismaService.user.delete({ where: { id: user.id } });
  }

  async findByEmail(email: string) {
    try {
      const user = this.prismaService.user.findFirst({
        where: { email },
      });
      if (!user) {
        throw new NotFoundException(`User with email ${email} not found`);
      }
      return user;
    } catch (error) {
      throw error;
    }
  }
}
