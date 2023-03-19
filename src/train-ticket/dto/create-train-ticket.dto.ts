import { ApiProperty } from '@nestjs/swagger';
import {
  IsDateString,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreateTrainTicketDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  price: number;

  @ApiProperty()
  @IsNotEmpty()
  @IsDateString()
  date: Date;

  // @ApiProperty()
  // @IsNotEmpty()
  // @IsString()
  // tripId: string;

  // @ApiProperty()
  // @IsOptional()
  // @IsString()
  // bookingId?: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  seatId?: string;
}
