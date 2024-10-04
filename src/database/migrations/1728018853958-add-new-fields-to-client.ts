import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddNewFieldsToClient1728018853958 implements MigrationInterface {
  name = 'AddNewFieldsToClient1728018853958';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`customer_clients\` DROP COLUMN \`name\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`customer_clients\` DROP COLUMN \`tags\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`customer_clients\` ADD \`first_name\` varchar(255) NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE \`customer_clients\` ADD \`last_name\` varchar(255) NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE \`customer_clients\` ADD \`address\` varchar(255) NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE \`customer_clients\` ADD \`phone\` varchar(255) NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE \`customer_clients\` ADD \`company\` varchar(255) NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE \`customer_clients\` ADD \`source\` enum ('By Admin', 'By Copy and Paste', 'By File Upload') NOT NULL`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`customer_clients\` DROP COLUMN \`source\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`customer_clients\` DROP COLUMN \`company\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`customer_clients\` DROP COLUMN \`phone\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`customer_clients\` DROP COLUMN \`address\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`customer_clients\` DROP COLUMN \`last_name\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`customer_clients\` DROP COLUMN \`first_name\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`customer_clients\` ADD \`tags\` json NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE \`customer_clients\` ADD \`name\` varchar(255) NULL`,
    );
  }
}
