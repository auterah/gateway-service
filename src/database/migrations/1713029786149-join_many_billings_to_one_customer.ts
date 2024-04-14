import { MigrationInterface, QueryRunner } from 'typeorm';

export class JoinManyBillingsToOneCustomer1713029786149
  implements MigrationInterface
{
  name = 'JoinManyBillingsToOneCustomer1713029786149';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`billings\` ADD CONSTRAINT \`FK_171d274c1a4e3823e3e5dfd8bdf\` FOREIGN KEY (\`customer_id\`) REFERENCES \`customers\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`billings\` DROP FOREIGN KEY \`FK_171d274c1a4e3823e3e5dfd8bdf\``,
    );
  }
}
