import { PartialType } from '@nestjs/swagger';
import { CreateTrainTicketDto } from './create-train-ticket.dto';

export class UpdateTrainTicketDto extends PartialType(CreateTrainTicketDto) {}
