import sgMail from '@sendgrid/mail';
import { envs } from '../configs';

export interface SendMailOptions {
  to: string | string[];
  subject: string;
  from?: string;
  htmlBody: string;
  text: string;
}

sgMail.setApiKey(envs.SENDGRID_API_KEY);

export const sendEmail = async (options: SendMailOptions) => {
  const { to, subject, htmlBody, text } = options;

  const msg = {
    to,
    from: envs.MAILER_EMAIL,
    subject,
    text,
    html: htmlBody,
  };

  await sgMail.send(msg);
};