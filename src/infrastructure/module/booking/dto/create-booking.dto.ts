import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsString } from 'class-validator';

enum BookingStatus {
  PENDING = 'PENDING',
  VALIDATE = 'VALIDATE',
  CANCELLED = 'CANCELLED',
}

export class CreateBookingDto {
  @IsNotEmpty()
  @IsString()
  @IsEnum(BookingStatus)
  status: BookingStatus;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  userId: string;
}
