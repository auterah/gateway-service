import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddIsActiveToApp1727778269494 implements MigrationInterface {
  name = 'AddIsActiveToApp1727778269494';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`apps\` ADD \`is_active\` tinyint NOT NULL DEFAULT 1`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE \`apps\` DROP COLUMN \`is_active\``);
  }
}
