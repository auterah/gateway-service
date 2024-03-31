import { Request } from 'express';
import App from 'src/modules/app/entities/app.entity';
import Customer from 'src/modules/customer/customer.entity';

export type CurrentApp = Request & { currentApp: App };
export type CurrentCustomer = Request & { currentCustomer: Customer };
