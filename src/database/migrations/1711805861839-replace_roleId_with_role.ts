import { MigrationInterface, QueryRunner } from 'typeorm';

export class ReplaceRoleIdWithRole1711805861839 implements MigrationInterface {
  name = 'ReplaceRoleIdWithRole1711805861839';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`customers\` CHANGE \`role_id\` \`role\` varchar(255) NOT NULL`,
    );
    await queryRunner.query(`ALTER TABLE \`customers\` DROP COLUMN \`role\``);
    await queryRunner.query(
      `ALTER TABLE \`customers\` ADD \`role\` enum ('Admin', 'Superadmin') NOT NULL DEFAULT 'Admin'`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE \`customers\` DROP COLUMN \`role\``);
    await queryRunner.query(
      `ALTER TABLE \`customers\` ADD \`role\` varchar(255) NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE \`customers\` CHANGE \`role\` \`role_id\` varchar(255) NOT NULL`,
    );
  }
}
