import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  VersionColumn,
} from 'typeorm';

@Entity('currencies')
export class Currency {
  @PrimaryGeneratedColumn('uuid')
  readonly id: string;

  @Column('varchar')
  name: string;

  @Column('varchar')
  code: string;

  @Column('varchar', { nullable: true })
  symbol: string;

  @Column('boolean', { default: false })
  default: boolean;

  @Column('boolean', { default: false })
  active: boolean;

  @CreateDateColumn()
  readonly createdAt: Date;

  @UpdateDateColumn()
  readonly updatedAt: Date;

  @DeleteDateColumn()
  readonly deletedAt: Date;

  @VersionColumn()
  readonly version: number;
}
