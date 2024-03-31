import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateAdminEntity1711844644656 implements MigrationInterface {
  name = 'CreateAdminEntity1711844644656';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE \`admins\` (\`id\` varchar(36) NOT NULL, \`email\` varchar(255) NULL, \`password\` varchar(255) NULL, \`role\` enum ('Admin', 'Superadmin') NOT NULL DEFAULT 'Superadmin', \`otp\` int NULL, \`verified\` tinyint NOT NULL DEFAULT 0, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE \`admins\``);
  }
}
