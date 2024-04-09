import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { EDefaultBillingType } from '../enums/default_billing_type';

@Entity('billing_plans')
export default class BillingPlan {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  name: string;

  @Column({ unique: true, default: EDefaultBillingType.FREEMIUM })
  type: string;

  @Column({ default: true })
  active: boolean;

  // @Column()
  // duration: number; // This is the no. of days in a month & this will be set automatically at the

  @Column({
    default: 1,
    name: 'billing_cycle',
    comment: 'Range: 1 - 12 (in months)',
  })
  cycles: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
