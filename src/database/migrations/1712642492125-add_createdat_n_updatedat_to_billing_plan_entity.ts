import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddCreatedatNUpdatedatToBillingPlanEntity1712642492125
  implements MigrationInterface
{
  name = 'AddCreatedatNUpdatedatToBillingPlanEntity1712642492125';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`billing_plans\` ADD \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6)`,
    );
    await queryRunner.query(
      `ALTER TABLE \`billing_plans\` ADD \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6)`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`billing_plans\` DROP COLUMN \`updated_at\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`billing_plans\` DROP COLUMN \`created_at\``,
    );
  }
}
