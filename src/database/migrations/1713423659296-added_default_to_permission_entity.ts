import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddedDefaultToPermissionEntity1713423659296
  implements MigrationInterface
{
  name = 'AddedDefaultToPermissionEntity1713423659296';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`permissions\` ADD \`default\` tinyint NOT NULL DEFAULT 0`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`permissions\` DROP COLUMN \`default\``,
    );
  }
}
