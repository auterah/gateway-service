import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  VersionColumn,
} from 'typeorm';

import { Currency } from './currency.entity';

@Entity('regions')
export class Region {
  @PrimaryGeneratedColumn('uuid')
  readonly id: string;

  @Column()
  name: string;

  @Column({ nullable: true })
  flagSvg: string;

  @Column({ nullable: true })
  flagPng: string;

  @Column('boolean', { default: false })
  active: boolean;

  @Column('boolean', { default: false })
  default: boolean;

  @Column({ nullable: true })
  code: string;

  @ManyToOne(() => Currency, {
    onDelete: 'SET NULL',
    nullable: true,
    eager: true,
  })
  @JoinColumn()
  currency: Currency;

  @Column({ nullable: true })
  demonym: string;

  @CreateDateColumn()
  readonly createdAt: Date;

  @UpdateDateColumn()
  readonly updatedAt: Date;

  @DeleteDateColumn()
  readonly deletedAt: Date;

  @VersionColumn()
  readonly version: number;
}
