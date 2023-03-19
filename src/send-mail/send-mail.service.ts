import { Inject, Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class SendMailService {
  @Inject(ConfigService)
  public config: ConfigService;

  constructor(private mailerService: MailerService) {}

  async sendMailToConfirmBooking(bookingInfo: any, uuid: string) {
    const mailFrom: string = this.config.get('MAIL_FROM');
    const urlApi = `http://localhost:4000/booking/confirm/${uuid}`;
    return await this.mailerService.sendMail({
      to: bookingInfo.user.email,
      from: mailFrom,
      subject: 'Booking api - Confirmation réservation ✔',
      template: 'validate-booking',
      context: {
        url: `${urlApi}`,
        uuid: uuid,
        name: bookingInfo.user.name,
        trainTickets: bookingInfo.trainTickets,
      },
    });
  }

  async sendMailToCancelledBooking(bookingInfo: any, uuid: string) {
    const mailFrom: string = this.config.get('MAIL_FROM');
    const urlApi = `http://localhost:4000/booking/confirm/cancelled/${uuid}`;
    return await this.mailerService.sendMail({
      to: bookingInfo.user.email,
      from: mailFrom,
      subject: 'Booking api - Annulation réservation ✔',
      template: 'cancelled-booking',
      context: {
        url: `${urlApi}`,
        uuid: uuid,
        name: bookingInfo.user.name,
        trainTickets: bookingInfo.trainTickets,
      },
    });
  }
}
