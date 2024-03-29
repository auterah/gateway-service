import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity('settings')
export default class Setting {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: false })
  skey: string;

  @Column({ nullable: false })
  value: string;

  @Column()
  type: string;

  @Column()
  name: string;

  @Column()
  length: string;
}
