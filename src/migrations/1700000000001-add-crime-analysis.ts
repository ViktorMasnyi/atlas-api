import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddCrimeAnalysis1700000000001 implements MigrationInterface {
  name = 'AddCrimeAnalysis1700000000001';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // Add zip_code and crime_score columns to loan_applications table
    await queryRunner.query(`
      ALTER TABLE "loan_applications" 
      ADD COLUMN "zip_code" varchar(10) NOT NULL DEFAULT '',
      ADD COLUMN "crime_score" decimal(3,2)
    `);

    // Create crime_data table
    await queryRunner.query(`
      CREATE TABLE "crime_data" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "zip_code" varchar(10) NOT NULL,
        "crime_score" decimal(3,2) NOT NULL,
        "raw_data" jsonb NOT NULL,
        "last_updated" timestamptz NOT NULL,
        "created_at" timestamptz NOT NULL DEFAULT now(),
        "updated_at" timestamptz NOT NULL DEFAULT now(),
        CONSTRAINT "PK_crime_data" PRIMARY KEY ("id"),
        CONSTRAINT "UQ_crime_data_zip_code" UNIQUE ("zip_code")
      )
    `);

    // Create index on zip_code for better performance
    await queryRunner.query(`
      CREATE INDEX "IDX_crime_data_zip_code" ON "crime_data" ("zip_code")
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Drop crime_data table
    await queryRunner.query(`DROP TABLE "crime_data"`);

    // Remove columns from loan_applications table
    await queryRunner.query(`
      ALTER TABLE "loan_applications" 
      DROP COLUMN "zip_code",
      DROP COLUMN "crime_score"
    `);
  }
}
