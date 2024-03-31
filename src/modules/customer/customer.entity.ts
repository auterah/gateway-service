import App from 'src/modules/app/entities/app.entity';
import { Roles } from 'src/shared/enums/roles';
import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';

@Entity('customers')
export default class Customer {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'business_name', nullable: true })
  businessName: string;

  @Column({ nullable: true })
  email: string;

  @Column({ nullable: true })
  password: string;

  @OneToMany(() => App, (app) => app.customer, { eager: true })
  // @JoinColumn({ name: 'customer_id', referencedColumnName: 'id' })
  apps: App[];

  @Column({ type: 'enum', default: Roles.ADMIN, enum: Roles })
  role: Roles;

  @Column({ nullable: true })
  otp: number;

  @Column({ default: false, type: 'boolean' })
  verified: boolean;
}
