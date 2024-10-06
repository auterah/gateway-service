import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  ManyToOne,
  OneToMany,
  JoinColumn,
  JoinTable,
  ManyToMany,
  VersionColumn,
} from 'typeorm';
import ClientTag from './client_tag.entity';
import Customer from './customer.entity';
import { ClientSource } from '../enums/client_source.enum';

@Entity('customer_clients')
export default class Client {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ nullable: true })
  firstName: string;

  @Column({ nullable: true })
  lastName: string;

  @Column()
  email: string;

  @Column({ nullable: true })
  address: string;

  @Column({ nullable: true })
  phone: string;

  @Column({ nullable: true })
  company: string;

  @ManyToMany(() => ClientTag, (tag) => tag.client)
  @JoinTable()
  tags: ClientTag[];

  @Column({ name: 'customer_id' })
  customerId: string;

  @ManyToOne(() => Customer, (customer) => customer.clients)
  customer: Customer;

  @Column({ default: false, type: 'boolean' })
  verified: boolean;

  @Column({ type: 'date', nullable: true })
  dob: Date;

  @Column({ type: 'enum', enum: ClientSource })
  source: ClientSource;

  @Column({ default: true, type: 'boolean' })
  isSubscribed: boolean;

  @Column()
  appId: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deleteAt: Date;

  @VersionColumn()
  version: number;
}
