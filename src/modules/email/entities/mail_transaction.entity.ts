import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { EMailTransactionStatus } from '../enums/mail_transaction_status';

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

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
