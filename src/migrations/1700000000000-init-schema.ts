import { MigrationInterface, QueryRunner } from 'typeorm';

export class InitSchema1700000000000 implements MigrationInterface {
  name = 'InitSchema1700000000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('CREATE EXTENSION IF NOT EXISTS pgcrypto');
    await queryRunner.query(`CREATE TABLE IF NOT EXISTS business_rules (
      id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
      version varchar(50) NOT NULL UNIQUE,
      rules jsonb NOT NULL,
      is_active boolean NOT NULL DEFAULT false,
      created_at timestamptz NOT NULL DEFAULT now()
    )`);

    await queryRunner.query(`CREATE TABLE IF NOT EXISTS rule_history (
      id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
      old_version varchar(50),
      new_version varchar(50) NOT NULL,
      changed_by varchar(100) NOT NULL,
      changed_at timestamptz NOT NULL DEFAULT now(),
      change_description varchar(500)
    )`);

    await queryRunner.query(`CREATE TABLE IF NOT EXISTS loan_applications (
      id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
      applicant_name varchar(255) NOT NULL,
      credit_score int NOT NULL,
      monthly_income numeric NOT NULL,
      requested_amount numeric NOT NULL,
      loan_term_months int NOT NULL,
      eligible boolean NOT NULL,
      reason varchar(500) NOT NULL,
      evaluated_at timestamptz NOT NULL,
      rule_version_used varchar(50) NOT NULL,
      created_at timestamptz NOT NULL DEFAULT now(),
      updated_at timestamptz NOT NULL DEFAULT now()
    )`);

    // seed default rules v1.0
    await queryRunner.query(
      `INSERT INTO business_rules (version, rules, is_active)
      VALUES ('v1.0', $1::jsonb, true)
      ON CONFLICT (version) DO NOTHING`,
      [
        JSON.stringify([
          {
            conditions: {
              all: [
                {
                  fact: 'creditScore',
                  operator: 'greaterThanInclusive',
                  value: 700,
                },
                {
                  fact: 'monthlyIncomeRatio',
                  operator: 'greaterThan',
                  value: 1.5,
                },
              ],
            },
            event: {
              type: 'eligible',
              params: { eligible: true, reason: 'Passed all checks' },
            },
          },
          {
            conditions: {
              any: [
                { fact: 'creditScore', operator: 'lessThan', value: 700 },
                {
                  fact: 'monthlyIncomeRatio',
                  operator: 'lessThanInclusive',
                  value: 1.5,
                },
              ],
            },
            event: {
              type: 'ineligible',
              params: {
                eligible: false,
                reason: 'Credit score too low or insufficient monthly income',
              },
            },
          },
        ]),
      ],
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('DROP TABLE IF EXISTS loan_applications');
    await queryRunner.query('DROP TABLE IF EXISTS rule_history');
    await queryRunner.query('DROP TABLE IF EXISTS business_rules');
  }
}
