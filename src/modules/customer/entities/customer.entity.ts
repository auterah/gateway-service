import App from 'src/modules/app/entities/app.entity';
import { Roles } from 'src/shared/enums/roles';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToMany,
  OneToOne,
  CreateDateColumn,
  DeleteDateColumn,
  UpdateDateColumn,
  VersionColumn,
} from 'typeorm';
import Billing from '../../billing/entities/billing.entity';
import ClientTag from './client_tag.entity';
import Client from './client.entity';
import CustomerSettings from './customer_settings.entity';
import CustomerAddress from './customer_address.entity';
import LoginSession from 'src/modules/auth/entities/login_session.entity';

@Entity('customers')
export default class Customer {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'business_name', nullable: true, unique: true })
  businessName: string;

  @Column({ nullable: true, unique: true })
  email: string;

  @Column({ nullable: true })
  password: string;

  @OneToMany(() => App, (app) => app.customer, { eager: true })
  // @JoinColumn({ name: 'customer_id', referencedColumnName: 'id' })
  apps: App[];

  @OneToMany(() => Billing, (bill) => bill.customer)
  billings: Billing[];

  @OneToMany(() => Client, (client) => client.customer)
  clients: Client[];

  @OneToMany(() => ClientTag, (tag) => tag.customer)
  tags: ClientTag[];

  @OneToOne(() => CustomerSettings, (settings) => settings.customer)
  settings: CustomerSettings;

  @OneToMany(() => CustomerAddress, (address) => address.customer, {
    eager: true,
  })
  addresses: CustomerAddress[];

  @OneToMany(() => LoginSession, (session) => session.customer)
  loginSessions: LoginSession[];

  @Column({ type: 'enum', default: Roles.ADMIN, enum: Roles })
  role: Roles;

  @Column({ nullable: true })
  otp: number;

  @Column({ default: false, type: 'boolean' })
  verified: boolean;

  @Column({ nullable: true })
  encryptionKey: string;

  @Column()
  phone: string;

  @CreateDateColumn()
  readonly createdAt: Date;

  @UpdateDateColumn()
  readonly updatedAt: Date;

  @DeleteDateColumn()
  readonly deletedAt: Date;

  @VersionColumn()
  readonly version: number;
}
