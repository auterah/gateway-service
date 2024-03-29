import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  ManyToMany,
} from 'typeorm';
import Role from '../role/role.entity';
import App from 'src/modules/app/entities/app.entity';

@Entity('permissions')
export default class Permission {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column({ unique: true })
  action: string;

  @Column()
  target: string; // A.K.A route OR endpoint

  @ManyToMany(() => Role, (role) => role.permissions)
  role: Role;

  @ManyToMany(() => App, (app) => app.scopes)
  app: App;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
