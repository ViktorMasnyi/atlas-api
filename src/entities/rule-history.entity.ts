import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('rule_history')
export class RuleHistory {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'old_version', type: 'varchar', length: 50, nullable: true })
  oldVersion: string | null;

  @Column({ name: 'new_version', type: 'varchar', length: 50 })
  newVersion: string;

  @Column({ name: 'changed_by', type: 'varchar', length: 100 })
  changedBy: string;

  @CreateDateColumn({ name: 'changed_at', type: 'timestamptz' })
  changedAt: Date;

  @Column({
    name: 'change_description',
    type: 'varchar',
    length: 500,
    nullable: true,
  })
  changeDescription: string | null;
}
