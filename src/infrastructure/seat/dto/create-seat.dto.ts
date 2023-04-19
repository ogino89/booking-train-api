import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateSeatDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  seatNo: number;

  @ApiProperty()
  @IsNotEmpty()
  @IsBoolean()
  isAvailable: boolean;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  tripId: string;
}
