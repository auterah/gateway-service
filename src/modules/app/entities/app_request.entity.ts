import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
} from 'typeorm';
import { EAppRequestStatus } from '../enums/app_request_status';
@Entity('app_requests')
export default class AppRequest {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'app_id' })
  appId: string;

  @Column({ type: 'enum', enum: EAppRequestStatus })
  status: EAppRequestStatus;

  @Column({ nullable: true })
  message: string;

  @Column()
  route: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;
}
