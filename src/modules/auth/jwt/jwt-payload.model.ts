import Admin from 'src/modules/admin/admin.entity';
import Customer from 'src/modules/customer/customer.entity';

export interface JwtPayload<> {
  customer: Omit<Customer, 'apps'>;
  iat?: Date;
}

export interface AdminJwtPayload<> {
  admin: Admin;
  iat?: Date;
}
