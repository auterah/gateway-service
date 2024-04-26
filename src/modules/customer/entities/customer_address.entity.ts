import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  DeleteDateColumn,
  UpdateDateColumn,
  VersionColumn,
  ManyToOne,
} from 'typeorm';
import Customer from './customer.entity';

@Entity('customers_addresses')
export default class CustomerAddress {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ nullable: true })
  city: string;

  @Column({ name: 'office_code', nullable: true })
  officeCode: string;

  @Column({ nullable: true })
  street: string;

  @Column({ name: 'postal_code', nullable: true })
  postalCode: string;

  @ManyToOne(() => Customer, (customer) => customer.addresses)
  customer: Customer;

  @Column({ name: 'customer_id' })
  customerId: string;

  @Column({ name: 'region_id', nullable: true })
  regionId: string;

  @CreateDateColumn()
  readonly createdAt: Date;

  @UpdateDateColumn()
  readonly updatedAt: Date;

  @DeleteDateColumn()
  readonly deleteAt: Date;

  @VersionColumn()
  readonly version: number;
}
