import App from 'src/modules/app/entities/app.entity';
import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';

@Entity('customers')
export default class Customer {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'first_name' })
  firstName: string;

  @Column({ name: 'last_name' })
  lastName: string;

  @Column()
  email: string;

  @Column()
  password: string;

  @OneToMany(() => App, (app) => app.customer, { eager: true })
  // @JoinColumn({ name: 'customer_id', referencedColumnName: 'id' })
  apps: App[];

  @Column({ name: 'role_id' })
  roleId: string;
}
