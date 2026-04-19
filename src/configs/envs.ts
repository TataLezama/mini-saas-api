import 'dotenv/config';
import { get } from 'env-var';


export const envs = {

  PORT: get('PORT').required().asPortNumber(),
  
  DATABASE_URL: get('DATABASE_URL').required().asString(),
  DIRECT_URL: get('DIRECT_URL').required().asString(),

  JWT_SECRET: get('JWT_SECRET').required().asString(),

  MAILER_SERVICE: get('MAILER_SERVICE').required().asString(),
  MAILER_EMAIL: get('MAILER_EMAIL').required().asString(),
  MAILER_SECRET_KEY: get('MAILER_SECRET_KEY').required().asString(),

  SENDGRID_API_KEY: get('SENDGRID_API_KEY').required().asString(),

  WEBSERVICE_URL: get('WEBSERVICE_URL').required().asString(),

}