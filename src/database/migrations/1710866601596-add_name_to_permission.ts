import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddNameToPermission1710866601596 implements MigrationInterface {
  name = 'AddNameToPermission1710866601596';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`permissions\` ADD \`name\` varchar(255) NOT NULL`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE \`permissions\` DROP COLUMN \`name\``);
  }
}
