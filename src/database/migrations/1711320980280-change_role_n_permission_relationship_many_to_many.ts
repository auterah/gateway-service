import { MigrationInterface, QueryRunner } from 'typeorm';

export class ChangeRoleNPermissionRelationshipManyToMany1711320980280
  implements MigrationInterface
{
  name = 'ChangeRoleNPermissionRelationshipManyToMany1711320980280';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`permissions\` DROP FOREIGN KEY \`FK_f10931e7bb05a3b434642ed2797\``,
    );
    await queryRunner.query(
      `CREATE TABLE \`roles_permissions\` (\`role_id\` varchar(36) NOT NULL, \`permission_id\` varchar(36) NOT NULL, INDEX \`IDX_7d2dad9f14eddeb09c256fea71\` (\`role_id\`), INDEX \`IDX_337aa8dba227a1fe6b73998307\` (\`permission_id\`), PRIMARY KEY (\`role_id\`, \`permission_id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `ALTER TABLE \`permissions\` DROP COLUMN \`role_id\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`roles_permissions\` ADD CONSTRAINT \`FK_7d2dad9f14eddeb09c256fea719\` FOREIGN KEY (\`role_id\`) REFERENCES \`roles\`(\`id\`) ON DELETE CASCADE ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE \`roles_permissions\` ADD CONSTRAINT \`FK_337aa8dba227a1fe6b73998307b\` FOREIGN KEY (\`permission_id\`) REFERENCES \`permissions\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`roles_permissions\` DROP FOREIGN KEY \`FK_337aa8dba227a1fe6b73998307b\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`roles_permissions\` DROP FOREIGN KEY \`FK_7d2dad9f14eddeb09c256fea719\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`permissions\` ADD \`role_id\` varchar(36) NULL`,
    );
    await queryRunner.query(
      `DROP INDEX \`IDX_337aa8dba227a1fe6b73998307\` ON \`roles_permissions\``,
    );
    await queryRunner.query(
      `DROP INDEX \`IDX_7d2dad9f14eddeb09c256fea71\` ON \`roles_permissions\``,
    );
    await queryRunner.query(`DROP TABLE \`roles_permissions\``);
    await queryRunner.query(
      `ALTER TABLE \`permissions\` ADD CONSTRAINT \`FK_f10931e7bb05a3b434642ed2797\` FOREIGN KEY (\`role_id\`) REFERENCES \`roles\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }
}
