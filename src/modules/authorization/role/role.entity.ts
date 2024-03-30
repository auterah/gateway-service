import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToMany,
  JoinTable,
} from 'typeorm';
import Permission from '../permission/permission.entity';
import { Roles } from 'src/shared/enums/roles';

@Entity('roles')
export default class Role {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true, enum: Roles, type: 'enum' })
  role: Roles;

  @ManyToMany(() => Permission, (perm) => perm.role, { eager: true })
  @JoinTable()
  permissions: Permission[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
