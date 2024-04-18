import App from 'src/modules/app/entities/app.entity';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  OneToOne,
} from 'typeorm';

@Entity('smtps')
export default class Smtp {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'app_id' })
  appId: string;

  @Column()
  host: string;

  @Column()
  password: string;

  @Column()
  user: string;

  @Column()
  port: number;

  @OneToOne(() => App, {
    onDelete: 'CASCADE',
  })
  app: App;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
