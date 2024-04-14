import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddBouncedTo_mailTransactionsStatus1712326829835
  implements MigrationInterface
{
  name = 'AddBouncedTo_mailTransactionsStatus1712326829835';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`mail_transactions\` CHANGE \`status\` \`status\` enum ('Failed', 'Sent', 'Bounced') NOT NULL DEFAULT 'Sent'`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`mail_transactions\` CHANGE \`status\` \`status\` enum ('Failed', 'Sent') NOT NULL DEFAULT 'Sent'`,
    );
  }
}
