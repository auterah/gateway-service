import { MailOptions } from '../interfaces';

export const optMailTemplate = (otp: string, email: string): MailOptions => {
  return {
    html: `<b>${otp}</b>`,
    subject: 'Here is your OTP',
    to: email,
  };
};
