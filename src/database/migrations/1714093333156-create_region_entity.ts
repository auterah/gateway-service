import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateRegionEntity1714093333156 implements MigrationInterface {
  name = 'CreateRegionEntity1714093333156';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE \`regions\` (\`id\` varchar(36) NOT NULL, \`name\` varchar(255) NOT NULL, \`flag_svg\` varchar(255) NULL, \`flag_png\` varchar(255) NULL, \`active\` tinyint NOT NULL DEFAULT 0, \`default\` tinyint NOT NULL DEFAULT 0, \`code\` varchar(255) NULL, \`demonym\` varchar(255) NULL, \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`deleted_at\` datetime(6) NULL, \`version\` int NOT NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE \`regions\``);
  }
}
