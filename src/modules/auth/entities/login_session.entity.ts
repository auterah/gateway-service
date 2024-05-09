import Customer from 'src/modules/customer/entities/customer.entity';
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

@Entity('login_sessions')
export default class LoginSession {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'customer_id' })
  customerId: string;

  @Column({ nullable: true })
  location: string;

  @Column({ nullable: true })
  ipAddress: string;

  @Column({ nullable: true })
  userAgent: string; // Should be an enum: IOS | ANDROID | WINDOW | LINUX | MAC | POSTMAN | CHROME | FIREFOX, etc

  @Column({ nullable: true })
  deviceType: string;

  @ManyToOne(() => Customer, (customer) => customer.loginSessions)
  customer: Customer;

  @Column({ default: true, type: 'boolean' })
  status: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deleteAt: Date;

  @VersionColumn()
  version: number;
}
