import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddReadNBouncedToMailTransactions1712328591572
  implements MigrationInterface
{
  name = 'AddReadNBouncedToMailTransactions1712328591572';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`mail_transactions\` ADD \`read\` tinyint NOT NULL DEFAULT 0`,
    );
    await queryRunner.query(
      `ALTER TABLE \`mail_transactions\` ADD \`bounced\` tinyint NOT NULL DEFAULT 0`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`mail_transactions\` DROP COLUMN \`bounced\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`mail_transactions\` DROP COLUMN \`read\``,
    );
  }
}
