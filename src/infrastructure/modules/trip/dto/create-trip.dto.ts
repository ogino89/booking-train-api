import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class CreateTripDto {
  @ApiProperty()
  @IsNotEmpty()
  departure: string;

  @ApiProperty()
  @IsNotEmpty()
  arrival: string;
}
