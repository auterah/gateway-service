import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddCustomerIdToMailTransaction1727796446654
  implements MigrationInterface
{
  name = 'AddCustomerIdToMailTransaction1727796446654';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`mail_transactions\` ADD \`customer_id\` varchar(255) NOT NULL`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`mail_transactions\` DROP COLUMN \`customer_id\``,
    );
  }
}
