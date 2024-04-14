import { MigrationInterface, QueryRunner } from 'typeorm';

export class RemoveRecipientNameFromEmails1712332467073
  implements MigrationInterface
{
  name = 'RemoveRecipientNameFromEmails1712332467073';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`emails\` DROP COLUMN \`recipient_name\``,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`emails\` ADD \`recipient_name\` varchar(255) NULL`,
    );
  }
}
