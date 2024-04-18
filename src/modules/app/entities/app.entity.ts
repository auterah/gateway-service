import Permission from 'src/modules/authorization/permission/permission.entity';
import Customer from 'src/modules/customer/customer.entity';
import Smtp from 'src/modules/email/entities/smtp.entity';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  ManyToMany,
  JoinTable,
  OneToOne,
} from 'typeorm';

@Entity('apps')
export default class App {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column({ name: 'private_key' })
  privateKey: string;

  @Column({ name: 'public_key' })
  publicKey: string;

  @ManyToOne(() => Customer, (customer) => customer.apps)
  customer: Customer;

  @ManyToMany(() => Permission, (perm) => perm.role, { eager: true })
  @JoinTable()
  scopes: Permission[];

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  cost: number;

  @OneToOne(() => Smtp)
  smtp: Smtp;

  @Column({ default: 0 })
  sentScore: number;

  @Column({ default: 0 })
  failedScore: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
