import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddMessageToMailTransaction1711431391721
  implements MigrationInterface
{
  name = 'AddMessageToMailTransaction1711431391721';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`mail_transactions\` ADD \`message\` varchar(255) NULL`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`mail_transactions\` DROP COLUMN \`message\``,
    );
  }
}
