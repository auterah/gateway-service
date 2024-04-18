import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateSmtpEntity1713454054228 implements MigrationInterface {
  name = 'CreateSmtpEntity1713454054228';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE \`smtps\` (\`id\` varchar(36) NOT NULL, \`app_id\` varchar(255) NOT NULL, \`host\` varchar(255) NOT NULL, \`password\` varchar(255) NOT NULL, \`user\` varchar(255) NOT NULL, \`port\` int NOT NULL, \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE \`smtps\``);
  }
}
