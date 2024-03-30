import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateMailTransactionEntity1711101845401
  implements MigrationInterface
{
  name = 'CreateMailTransactionEntity1711101845401';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE \`mail_transactions\` (\`id\` varchar(36) NOT NULL, \`app_id\` varchar(255) NOT NULL, \`recipient_name\` varchar(255) NOT NULL, \`email\` varchar(255) NOT NULL, \`status\` enum ('Failed', 'Sent') NOT NULL DEFAULT 'Sent', \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE \`mail_transactions\``);
  }
}
