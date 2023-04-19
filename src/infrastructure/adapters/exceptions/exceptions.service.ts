import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import {
  IException,
  IFormatExceptionMessage,
} from '../../../domain/ports/exceptions.interface';

@Injectable()
export class ExceptionsService implements IException {
  notFoundException(data?: IFormatExceptionMessage): void {
    throw new NotFoundException(data);
  }
  unauthorizedException(data?: IFormatExceptionMessage): void {
    throw new UnauthorizedException(data);
  }
  conflictException(data?: IFormatExceptionMessage): void {
    throw new ConflictException(data);
  }
  badRequestException(data: IFormatExceptionMessage): void {
    throw new BadRequestException(data);
  }
  internalServerErrorException(data?: IFormatExceptionMessage): void {
    throw new InternalServerErrorException(data);
  }
  forbiddenException(data?: IFormatExceptionMessage): void {
    throw new ForbiddenException(data);
  }
}
