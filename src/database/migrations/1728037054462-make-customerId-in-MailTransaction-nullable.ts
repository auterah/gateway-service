import { MigrationInterface, QueryRunner } from 'typeorm';

export class MakeCustomerIdInMailTransactionNullable1728037054462
  implements MigrationInterface
{
  name = 'MakeCustomerIdInMailTransactionNullable1728037054462';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`mail_transactions\` CHANGE \`customer_id\` \`customer_id\` varchar(255) NULL`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`mail_transactions\` CHANGE \`customer_id\` \`customer_id\` varchar(255) NOT NULL`,
    );
  }
}
