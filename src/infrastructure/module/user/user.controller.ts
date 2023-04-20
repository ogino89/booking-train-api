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
  Inject,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { ApiBearerAuth, ApiQuery, ApiTags } from '@nestjs/swagger';
import { JwtGuard } from '../auth/guards/jwt.guard';
import { CreateUserUseCase } from 'src/domain/user/usecase/create-user.usecase';
import { LoggerService } from '../../adapters/logger/logger.service';
import { ExceptionsService } from '../../adapters/exceptions/exceptions.service';
import { BcryptService } from '../../adapters/bcrypt/bcrypt.service';
import { UserModel } from 'src/domain/user/model/user.model';
import { FindAllUserUseCase } from 'src/domain/user/usecase/findAll-user.usecase';
import { FindOneUserUseCase } from 'src/domain/user/usecase/findOne-user.usecase';
import { UpdateUserUseCase } from 'src/domain/user/usecase/update-user.usecase';
import { DeleteUserUseCase } from 'src/domain/user/usecase/delete-user.usecase';

@ApiBearerAuth()
@UseGuards(JwtGuard)
@ApiTags('User')
@Controller('user')
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly hashingService: BcryptService,
    private readonly loggerService: LoggerService,
    private readonly exceptionService: ExceptionsService,
  ) {}

  @Post()
  async create(@Body() createUserDto: CreateUserDto) {
    const createUserUseCase = new CreateUserUseCase(
      this.userService,
      this.hashingService,
      this.loggerService,
      this.exceptionService,
    );
    const user = new UserModel(
      createUserDto.name,
      createUserDto.email,
      createUserDto.password,
    );

    const createdUser = await createUserUseCase.execute(user);
    return createdUser;
  }

  @Get()
  async findAll() {
    const findAllUserUsecase = new FindAllUserUseCase(
      this.userService,
      this.loggerService,
      this.exceptionService,
    );
    return await findAllUserUsecase.execute();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const findOneUseUsecase = new FindOneUserUseCase(
      this.userService,
      this.loggerService,
      this.exceptionService,
    );
    return await findOneUseUsecase.execute(id);
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    const updateUserUsecase = new UpdateUserUseCase(
      this.userService,
      this.loggerService,
      this.exceptionService,
    );
    return await updateUserUsecase.execute(id, <UserModel>updateUserDto);
  }

  @Delete(':id')
  async delete(@Param('id') id: string) {
    const deleteUserUseCase = new DeleteUserUseCase(
      this.userService,
      this.loggerService,
      this.exceptionService,
    );

    return await deleteUserUseCase.execute(id);
  }
}
