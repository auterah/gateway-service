import Admin from 'src/modules/admin/admin.entity';
import { MailOptions } from '../interfaces';
import App from 'src/modules/app/entities/app.entity';
import { configs } from 'config/config.env';

export const adminOTPMailTemplate = (
  admin: Admin,
  app: App,
  password: string,
): MailOptions => {
  return {
    html: `Welcome! Here is your app credentials: <br>
    <b>otp:</b> ${admin.otp} <br>
    <b>password:</b> ${password} <br>
    <b>name:</b> ${app.name} <br>
    <b>publicKey:</b> ${app.publicKey} <br>
    `,
    subject: 'Here is your OTP',
    to: admin.email,
  };
};

export const customerOTPMailTemplate = (
  otp: string,
  email: string,
): MailOptions => {
  return {
    html: `<h2>Hi Welcome to ${configs.COMPANY_NAME}!</h2><h3><span style="font-weight: 100;">Here is your OTP: </span>${otp}</h3>`,
    subject: 'Here is your OTP',
    to: email,
  };
};
