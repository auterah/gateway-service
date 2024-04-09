import { MigrationInterface, QueryRunner } from 'typeorm';

export class ChangeStatusToStringInBillingPlanEntity1712642362338
  implements MigrationInterface
{
  name = 'ChangeStatusToStringInBillingPlanEntity1712642362338';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`billing_plans\` ADD UNIQUE INDEX \`IDX_6007f0b546e36fd85ac96e3b3e\` (\`name\`)`,
    );
    await queryRunner.query(
      `ALTER TABLE \`billing_plans\` DROP COLUMN \`type\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`billing_plans\` ADD \`type\` varchar(255) NOT NULL DEFAULT 'Freemium'`,
    );
    await queryRunner.query(
      `ALTER TABLE \`billing_plans\` ADD UNIQUE INDEX \`IDX_ff64c35d8af148e9ba34d2afb6\` (\`type\`)`,
    );
    await queryRunner.query(
      `ALTER TABLE \`billing_plans\` CHANGE \`billing_cycle\` \`billing_cycle\` int NOT NULL COMMENT 'Range: 1 - 12 (in months)' DEFAULT '1'`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`billing_plans\` CHANGE \`billing_cycle\` \`billing_cycle\` int NOT NULL DEFAULT '1'`,
    );
    await queryRunner.query(
      `ALTER TABLE \`billing_plans\` DROP INDEX \`IDX_ff64c35d8af148e9ba34d2afb6\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`billing_plans\` DROP COLUMN \`type\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`billing_plans\` ADD \`type\` enum ('Freemium', 'Premium') NOT NULL DEFAULT 'Freemium'`,
    );
    await queryRunner.query(
      `ALTER TABLE \`billing_plans\` DROP INDEX \`IDX_6007f0b546e36fd85ac96e3b3e\``,
    );
  }
}
