import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('emails')
export default class Email {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'recipient_name', nullable: true })
  recipientName: string;

  @Column()
  email: string;

  @Column()
  html: string;

  @Column()
  subject: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
