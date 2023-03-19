import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { ApiBearerAuth, ApiQuery, ApiTags } from '@nestjs/swagger';
import { PrismaHelperService } from 'src/helper/prisma-helper/prisma-helper.service';
import { Prisma } from '@prisma/client';
import { JwtGuard } from 'src/auth/guards/jwt.guard';

@ApiBearerAuth()
@UseGuards(JwtGuard)
@ApiTags('User')
@Controller('user')
export class UserController {
  constructor(
    private readonly userService: UserService,
    private prismaHelperService: PrismaHelperService,
  ) {}

  @Post()
  async create(@Body() createUserDto: CreateUserDto) {
    let createdUser = await this.userService.create(
      <Prisma.UserCreateInput>createUserDto,
    );
    return createdUser;
  }

  @Get()
  @ApiQuery({ name: 'args', required: false })
  async findAll(@Query('args') prismaArgs: string) {
    let users = await this.userService.findAll(
      this.prismaHelperService.parsePrismaArgs(prismaArgs),
    );
    return users;
  }

  @Get(':id')
  @ApiQuery({ name: 'args', required: false })
  async findOne(@Param('id') id: string, @Query('args') prismaArgs: string) {
    let user = await this.userService.findOne(
      id,
      this.prismaHelperService.parsePrismaArgs(prismaArgs),
    );
    delete user.password;
    return user;
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    let udpatedUser = await this.userService.update(
      id,
      <Prisma.UserUpdateInput>updateUserDto,
    );
    delete udpatedUser.password;
    return udpatedUser;
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.userService.remove(id);
  }
}
