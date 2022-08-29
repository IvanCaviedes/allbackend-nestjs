import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';
import { MailConstants } from 'src/constants';

@Injectable()
export class MailService {
  constructor(private readonly mailerService: MailerService) {}

  async sendMailLogin(email): Promise<any> {
    const date = new Date().toDateString();
    const title = `Acabas de iniciar sesion ${date}`;
    return await this.mailerService
      .sendMail({
        to: email,
        from: MailConstants.email,
        subject: title,
        html: '<b>welcome</b>',
      })
      .then(() => console.log('correcto'));
  }

  async sendMailSingUp(email): Promise<any> {
    const title = `Acabas de crear una cuenta `;
    return await this.mailerService
      .sendMail({
        to: email,
        from: MailConstants.email,
        subject: title,
        text: 'welcome',
        html: '<b>welcome</b>',
      })
      .then(() => console.log('correcto'));
  }

  async sendMailResetPassword(email) {
    const title = `Acabas de crear una cuenta `;
    return await this.mailerService
      .sendMail({
        to: email,
        from: MailConstants.email,
        subject: title,
        text: 'welcome',
        html: '<b>welcome</b>',
      })
      .then(() => console.log('correcto'));
  }
}
