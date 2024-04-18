import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddedPaidToBillingEntity1713447799694
  implements MigrationInterface
{
  name = 'AddedPaidToBillingEntity1713447799694';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`billings\` ADD \`paid\` tinyint NOT NULL DEFAULT 0`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE \`billings\` DROP COLUMN \`paid\``);
  }
}
