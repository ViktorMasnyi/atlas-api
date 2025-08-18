import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm';

@Entity('business_rules')
@Unique(['version'])
export class BusinessRule {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 50 })
  version: string;

  @Column({ type: 'jsonb' })
  rules: any;

  @Column({ name: 'is_active', type: 'boolean', default: false })
  isActive: boolean;

  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
  createdAt: Date;
}
