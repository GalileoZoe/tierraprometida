import { Injectable, Logger } from '@nestjs/common';
import * as nodemailer from 'nodemailer';

@Injectable()
export class EmailService {
  private readonly logger = new Logger(EmailService.name);

  private transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  async sendPaymentReceivedEmail(to: string, ticketPath?: string) {
    try {
      const mail = await this.transporter.sendMail({
        from: `"Tierra Prometida" <${process.env.EMAIL_USER}>`,
        to,
        subject: 'Tu pago ha sido recibido',
        text: 'Tu pago ha sido recibido correctamente.',
        attachments: ticketPath
          ? [
              {
                filename: ticketPath.split('/').pop(),
                path: ticketPath,
              },
            ]
          : [],
      });

      this.logger.log(`Correo enviado a ${to}`);
      return mail;
    } catch (err) {
      this.logger.error('Error enviando correo', err);
      throw err;
    }
  }
}
