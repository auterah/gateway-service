import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToMany,
  CreateDateColumn,
  DeleteDateColumn,
  UpdateDateColumn,
  OneToOne,
  JoinColumn,
  VersionColumn,
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

  // @OneToOne(() => Customer, (customer) => customer.settings)
  // customer: Customer;

  // @Column({ name: 'customer_id' })
  // customerId: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deleteAt: Date;

  @VersionColumn()
  version: number;
}
