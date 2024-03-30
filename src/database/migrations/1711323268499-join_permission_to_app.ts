import { MigrationInterface, QueryRunner } from 'typeorm';

export class JoinPermissionToApp1711323268499 implements MigrationInterface {
  name = 'JoinPermissionToApp1711323268499';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE \`apps_permissions\` (\`app_id\` varchar(36) NOT NULL, \`permission_id\` varchar(36) NOT NULL, INDEX \`IDX_e22224d5321d123d24aecd1a87\` (\`app_id\`), INDEX \`IDX_b8b695f903ed34ac1f6be71f3b\` (\`permission_id\`), PRIMARY KEY (\`app_id\`, \`permission_id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `ALTER TABLE \`apps_permissions\` ADD CONSTRAINT \`FK_e22224d5321d123d24aecd1a872\` FOREIGN KEY (\`app_id\`) REFERENCES \`apps\`(\`id\`) ON DELETE CASCADE ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE \`apps_permissions\` ADD CONSTRAINT \`FK_b8b695f903ed34ac1f6be71f3b6\` FOREIGN KEY (\`permission_id\`) REFERENCES \`permissions\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`apps_permissions\` DROP FOREIGN KEY \`FK_b8b695f903ed34ac1f6be71f3b6\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`apps_permissions\` DROP FOREIGN KEY \`FK_e22224d5321d123d24aecd1a872\``,
    );
    await queryRunner.query(
      `DROP INDEX \`IDX_b8b695f903ed34ac1f6be71f3b\` ON \`apps_permissions\``,
    );
    await queryRunner.query(
      `DROP INDEX \`IDX_e22224d5321d123d24aecd1a87\` ON \`apps_permissions\``,
    );
    await queryRunner.query(`DROP TABLE \`apps_permissions\``);
  }
}
