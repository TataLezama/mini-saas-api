import nodemailer, { Transporter } from 'nodemailer';
import { envs } from '../configs';

export interface SendMailOptions {
  to: string | string[];
  subject: string;
  htmlBody: string;
  attachements?: Attachement[];
}

export interface Attachement {
  filename: string;
  path: string;
}


export class EmailService {
    private transporter: Transporter;

    constructor(
        mailerService: string,
        mailerEmail: string,
        senderEmailPassword: string,
    ) {
        this.transporter = nodemailer.createTransport({
            service: envs.MAILER_SERVICE,
            auth: {
                user: envs.MAILER_EMAIL,
                pass: envs.MAILER_SECRET_KEY,
            },
        });
    }

  async sendEmail( options: SendMailOptions ): Promise<boolean> {

    const { to, subject, htmlBody, attachements = [] } = options;

    try {

      const sentInformation = await this.transporter.sendMail( {
        to: to,
        subject: subject,
        html: htmlBody,
        attachments: attachements,
      });

      // console.log( sentInformation );

      return true;
    } catch ( error ) {
      return false;
    }

  }

}