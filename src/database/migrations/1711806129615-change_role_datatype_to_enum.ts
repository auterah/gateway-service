import { MigrationInterface, QueryRunner } from 'typeorm';

export class ChangeRoleDatatypeToEnum1711806129615
  implements MigrationInterface
{
  name = 'ChangeRoleDatatypeToEnum1711806129615';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `DROP INDEX \`IDX_ccc7c1489f3a6b3c9b47d4537c\` ON \`roles\``,
    );
    await queryRunner.query(`ALTER TABLE \`roles\` DROP COLUMN \`role\``);
    await queryRunner.query(
      `ALTER TABLE \`roles\` ADD \`role\` enum ('Admin', 'Superadmin') NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE \`roles\` ADD UNIQUE INDEX \`IDX_ccc7c1489f3a6b3c9b47d4537c\` (\`role\`)`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`roles\` DROP INDEX \`IDX_ccc7c1489f3a6b3c9b47d4537c\``,
    );
    await queryRunner.query(`ALTER TABLE \`roles\` DROP COLUMN \`role\``);
    await queryRunner.query(
      `ALTER TABLE \`roles\` ADD \`role\` varchar(255) NOT NULL`,
    );
    await queryRunner.query(
      `CREATE UNIQUE INDEX \`IDX_ccc7c1489f3a6b3c9b47d4537c\` ON \`roles\` (\`role\`)`,
    );
  }
}
