import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddDobToCustomerClientsEntity1714333360019
  implements MigrationInterface
{
  name = 'AddDobToCustomerClientsEntity1714333360019';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`customer_clients\` ADD \`dob\` date NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE \`customer_clients\` ADD \`version\` int NOT NULL`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`customer_clients\` DROP COLUMN \`version\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`customer_clients\` DROP COLUMN \`dob\``,
    );
  }
}
