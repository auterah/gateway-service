import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  ManyToOne,
} from 'typeorm';
import Customer from 'src/modules/customer/entities/customer.entity';

@Entity('client_tags')
export default class ClientTag {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @ManyToOne(() => Customer, (customer) => customer.tags)
  customer: Customer;

  @Column({ name: 'customer_id' })
  customerId: string;

  // @ManyToOne(() => Customer, (customer) => customer.tags)
  // clien: Customer;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deleteAt: Date;
}
