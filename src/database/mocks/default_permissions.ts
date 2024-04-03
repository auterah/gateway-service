import { configs } from 'config/config.env';
import Permission from '../../modules/authorization/permission/permission.entity';

export const canSendSingleMail: Partial<Permission> = {
  name: 'Mail Action',
  action: 'Send Single Mail',
  target: `/${configs.API_VERSION}/emails/send`,
};

export const canSendBulkMails: Partial<Permission> = {
  name: 'Mail Action',
  action: 'Send Bulk Mails',
  target: `/${configs.API_VERSION}/emails/sendbulk`,
};

export const canTrackOpenMail: Partial<Permission> = {
  name: 'Mail Action',
  action: 'Track Open Mail',
  target: `/${configs.API_VERSION}/emails`,
};
