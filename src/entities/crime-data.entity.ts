import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('crime_data')
export class CrimeData {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'zip_code', type: 'varchar', length: 10, unique: true })
  zipCode: string;

  @Column({ name: 'crime_score', type: 'decimal', precision: 3, scale: 2 })
  crimeScore: number;

  @Column({ name: 'raw_data', type: 'jsonb' })
  rawData: any;

  @Column({ name: 'last_updated', type: 'timestamptz' })
  lastUpdated: Date;

  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamptz' })
  updatedAt: Date;
}
