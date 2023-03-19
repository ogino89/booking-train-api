import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class ConnectTrainTicketDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  seatId: string;
}
