import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsNotEmpty, ValidateNested } from 'class-validator';
import { ConnectTrainTicketDto } from 'src/train-ticket/dto/connect-train-ticket.dto';

export class CreateBookingWithTicketDto {
  @ApiProperty({
    type: [ConnectTrainTicketDto],
  })
  @IsNotEmpty()
  @ValidateNested({ each: true })
  @Type(() => ConnectTrainTicketDto)
  tickets: ConnectTrainTicketDto[];
}
