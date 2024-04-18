import { configs } from 'config/config.env';
import Permission from '../../modules/authorization/permission/permission.entity';

export const defaultPermissions: Partial<Permission>[] = [
  {
    name: 'Mail Action',
    action: 'Track Open Mail',
    target: `/${configs.API_VERSION}/emails`,
    default: true,
  },
  {
    name: 'Mail Action',
    action: 'Send Bulk Mails',
    target: `/${configs.API_VERSION}/emails/sendbulk`,
    default: true,
  },
  {
    name: 'Mail Action',
    action: 'Send Single Mail',
    target: `/${configs.API_VERSION}/emails/send`,
    default: true,
  },
  {
    name: 'Report Action',
    action: 'Fetch Single Report',
    target: `/${configs.API_VERSION}/reports/id/`,
    default: true,
  },
  {
    name: 'Report Action',
    action: 'Fetch All Reports',
    target: `/${configs.API_VERSION}/reports`,
    default: true,
  },
];
