import { Entity, Column, PrimaryGeneratedColumn, OneToMany, CreateDateColumn, DeleteDateColumn, UpdateDateColumn, OneToOne, JoinColumn } from 'typeorm';
import { configs } from 'config/config.env';
import Customer from './customer.entity';

@Entity('customer_settings')
export default class CustomerSettings {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ nullable: true })
  logo: string;

  @Column({
    name: 'logo_placeholder',
    default: configs.CUSTOMER_DEFAULT_PHOTO_URL,
  })
  logoPlaceholder: string;

  @Column({ nullable: true })
  favicon: string;

  @OneToOne(() => Customer, (customer) => customer.settings)
  customer: Customer;

  @Column({ name: 'customer_id' })
  customerId: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deleteAt: Date;
}
