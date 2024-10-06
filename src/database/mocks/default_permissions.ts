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
  {
    name: 'Client Action',
    action: 'Add Client',
    target: `/${configs.API_VERSION}/clients/add`,
    default: true,
  },
  {
    name: 'Client Action',
    action: 'Bulk Add Client',
    target: `/${configs.API_VERSION}/clients/bulk-add`,
    default: true,
  },
  {
    name: 'Client Action',
    action: 'Add Clients Via Email List',
    target: `/${configs.API_VERSION}/clients/email-list`,
    default: true,
  },
  {
    name: 'Client Action',
    action: 'Add Clients Via File Upload',
    target: `/${configs.API_VERSION}/clients/file-uploads`,
    default: true,
  },
  {
    name: 'Client Action',
    action: 'Manage Single Client',
    target: `/${configs.API_VERSION}/clients/id/:id`,
    default: true,
  },
  {
    name: 'Client Action',
    action: 'Get Statistics',
    target: `/${configs.API_VERSION}/clients/statistics`,
    default: true,
  },
];
