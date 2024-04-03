import Permission from 'src/modules/authorization/permission/permission.entity';
import Customer from 'src/modules/customer/customer.entity';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  ManyToMany,
  JoinTable,
} from 'typeorm';

@Entity('apps')
export default class App {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column({ name: 'private_key' })
  privateKey: string;

  @Column({ name: 'public_key' })
  publicKey: string;

  @ManyToOne(() => Customer, (customer) => customer.apps)
  customer: Customer;

  @ManyToMany(() => Permission, (perm) => perm.role, {
    eager: true,
    onDelete: 'CASCADE',
  })
  @JoinTable()
  scopes: Permission[];

}
