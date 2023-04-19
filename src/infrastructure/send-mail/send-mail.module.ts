import { Module } from '@nestjs/common';
import { SendMailService } from './send-mail.service';
import { SendMailController } from './send-mail.controller';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import { MailerModule } from '@nestjs-modules/mailer';

@Module({
  imports: [
    MailerModule.forRoot({
      transport:
        'smtps://' +
        process.env.MAIL_USER +
        ':' +
        process.env.MAIL_PASSWORD +
        '@' +
        process.env.MAIL_HOST +
        '',
      defaults: {
        from: '"No Reply" <' + process.env.MAIL_FROM + '>',
      },

      template: {
        dir: process.cwd() + '/template/',
        adapter: new HandlebarsAdapter(),
        options: {
          strict: true,
        },
      },
    }),
  ],
  controllers: [SendMailController],
  providers: [SendMailService],
  exports: [SendMailService],
})
export class SendMailModule {}
