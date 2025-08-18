import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('loan_applications')
export class LoanApplication {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'applicant_name', type: 'varchar', length: 255 })
  applicantName: string;

  @Column({ name: 'credit_score', type: 'int' })
  creditScore: number;

  @Column({ name: 'monthly_income', type: 'numeric' })
  monthlyIncome: number;

  @Column({ name: 'requested_amount', type: 'numeric' })
  requestedAmount: number;

  @Column({ name: 'loan_term_months', type: 'int' })
  loanTermMonths: number;

  @Column({ type: 'boolean' })
  eligible: boolean;

  @Column({ type: 'varchar', length: 500 })
  reason: string;

  @Column({ name: 'evaluated_at', type: 'timestamptz' })
  evaluatedAt: Date;

  @Column({ name: 'rule_version_used', type: 'varchar', length: 50 })
  ruleVersionUsed: string;

  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamptz' })
  updatedAt: Date;
}
