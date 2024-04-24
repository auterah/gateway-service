import { Request } from 'express';
import Admin from 'src/modules/admin/admin.entity';
import App from 'src/modules/app/entities/app.entity';
import Customer from 'src/modules/customer/entities/customer.entity';

export type CurrentApp = Request & { currentApp: App };
export type CurrentCustomer = Request & { currentCustomer: Customer };
export type CurrentAdmin = Request & {
  admin: Admin;
  currentCustomer: Customer;
};
