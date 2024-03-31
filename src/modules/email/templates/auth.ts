import { MailPayload } from 'src/shared/interfaces/mqtt';

export const optMailTemplate = (otp: string, email: string): MailPayload => {
  return {
    html: `<b>${otp}</b>`,
    subject: 'Here is your OTP',
    email,
  };
};
