import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { SendMailService } from './send-mail.service';
import { CreateSendMailDto } from './dto/create-send-mail.dto';
import { UpdateSendMailDto } from './dto/update-send-mail.dto';

@Controller('send-mail')
export class SendMailController {
  constructor(private readonly sendMailService: SendMailService) {}
}
