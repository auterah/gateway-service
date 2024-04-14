import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddAppIdToEmail1712323574840 implements MigrationInterface {
  name = 'AddAppIdToEmail1712323574840';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`emails\` ADD \`app_id\` varchar(255) NOT NULL`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE \`emails\` DROP COLUMN \`app_id\``);
  }
}
