import Customer from 'src/modules/customer/customer.entity';

export interface JwtPayload<> {
  customer: Omit<Customer, 'apps'>;
  iat?: Date;
}
