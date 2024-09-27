import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import MailTransaction from '../../report/entities/mail_transaction.entity';

@Entity('emails')
export default class Email {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'app_id' })
  appId: string;

  @Column({ nullable: true })
  email: string;

  @Column({ type: 'longtext' })
  html: string;

  @Column()
  subject: string;

  @OneToMany(() => MailTransaction, (tnx) => tnx.email, {
    onDelete: 'SET NULL',
  })
  transactions: MailTransaction[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
