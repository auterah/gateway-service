import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddAppidToApp1728081961184 implements MigrationInterface {
  name = 'AddAppidToApp1728081961184';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`customer_clients\` ADD \`app_id\` varchar(255) NOT NULL`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`customer_clients\` DROP COLUMN \`app_id\``,
    );
  }
}
