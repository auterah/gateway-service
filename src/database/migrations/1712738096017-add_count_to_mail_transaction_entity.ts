import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddCountToMailTransactionEntity1712738096017
  implements MigrationInterface
{
  name = 'AddCountToMailTransactionEntity1712738096017';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`mail_transactions\` ADD \`clicks\` int NOT NULL DEFAULT '0'`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`mail_transactions\` DROP COLUMN \`clicks\``,
    );
  }
}
