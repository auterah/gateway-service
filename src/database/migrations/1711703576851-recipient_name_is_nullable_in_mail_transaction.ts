import { MigrationInterface, QueryRunner } from 'typeorm';

export class RecipientNameIsNullableInMailTransaction1711703576851
  implements MigrationInterface
{
  name = 'RecipientNameIsNullableInMailTransaction1711703576851';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`mail_transactions\` CHANGE \`recipient_name\` \`recipient_name\` varchar(255) NULL`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`mail_transactions\` CHANGE \`recipient_name\` \`recipient_name\` varchar(255) NOT NULL`,
    );
  }
}
