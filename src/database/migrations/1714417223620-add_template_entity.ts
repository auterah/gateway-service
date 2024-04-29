import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddTemplateEntity1714417223620 implements MigrationInterface {
  name = 'AddTemplateEntity1714417223620';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE \`templates\` (\`id\` varchar(36) NOT NULL, \`customer_id\` varchar(255) NOT NULL, \`html\` varchar(255) NOT NULL, \`subject\` varchar(255) NULL, \`screen_shoot\` varchar(255) NULL, \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`version\` int NOT NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE \`templates\``);
  }
}
