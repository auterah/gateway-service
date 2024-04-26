import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateCurrencyEntity1714093138685 implements MigrationInterface {
  name = 'CreateCurrencyEntity1714093138685';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE \`currencies\` (\`id\` varchar(36) NOT NULL, \`name\` varchar(255) NOT NULL, \`code\` varchar(255) NOT NULL, \`symbol\` varchar(255) NULL, \`default\` tinyint NOT NULL DEFAULT 0, \`active\` tinyint NOT NULL DEFAULT 0, \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`deleted_at\` datetime(6) NULL, \`version\` int NOT NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE \`currencies\``);
  }
}
