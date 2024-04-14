import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddCostToMailTransactions1712339231099
  implements MigrationInterface
{
  name = 'AddCostToMailTransactions1712339231099';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`mail_transactions\` ADD \`cost\` decimal(10,2) NOT NULL DEFAULT '0.00'`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`mail_transactions\` DROP COLUMN \`cost\``,
    );
  }
}
