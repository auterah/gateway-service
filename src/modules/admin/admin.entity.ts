import { Roles } from 'src/shared/enums/roles';
import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';

@Entity('admins')
export default class Admin {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ nullable: true })
  email: string;

  @Column({ nullable: true })
  password: string;

  @Column({ type: 'enum', default: Roles.SUPER_ADMIN, enum: Roles })
  role: Roles;

  @Column({ nullable: true })
  otp: number;

  @Column({ default: false, type: 'boolean' })
  verified: boolean;
}
