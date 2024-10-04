import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
} from 'typeorm';
import { EMailTransactionStatus } from '../../email/enums/mail_transaction_status';
import Email from '../../email/entities/email.entity';

@Entity('mail_transactions')
export default class MailTransaction {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'app_id' })
  appId: string;

  @Column({ name: 'recipient_name', nullable: true })
  recipientName: string;

  @Column()
  email: string;

  @Column({
    type: 'enum',
    enum: EMailTransactionStatus,
    default: EMailTransactionStatus.SENT,
  })
  status: EMailTransactionStatus;

  @Column({ nullable: true })
  message: string;

  @Column({ default: false })
  opened: boolean;

  @Column({ default: false })
  bounced: boolean;

  @Column({ default: 0 })
  clicks: number;

  @ManyToOne(() => Email, (email) => email.transactions)
  mail: Email;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  cost: number;

  @Column({ nullable: true })
  customerId: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
