import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  ManyToMany,
} from 'typeorm';
import Customer from 'src/modules/customer/entities/customer.entity';
import { EPaymentMethods } from '../enums/payment_methods';

@Entity('billings')
export default class Billing {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  customerId: string;

  @ManyToOne(() => Customer, (customer) => customer.billings)
  customer: Customer;

  // @ManyToMany(() => Customer, (customer) => customer.billings)
  // plan: Customer;

  @Column({
    name: 'payment_method',
    enum: EPaymentMethods,
    type: 'enum',
    default: EPaymentMethods.TRANSFER,
  })
  paymentMethod: EPaymentMethods;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  amount: number;

  @CreateDateColumn({ comment: 'BillAt AKA end/charge date' })
  billAt: Date;

  @Column({ default: false })
  paid: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
