import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateAppRequestEntity1711317192801 implements MigrationInterface {
  name = 'CreateAppRequestEntity1711317192801';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE \`app_requests\` (\`id\` varchar(36) NOT NULL, \`app_id\` varchar(255) NOT NULL, \`status\` enum ('Successful', 'Failed') NOT NULL, \`message\` varchar(255) NULL, \`route\` varchar(255) NOT NULL, \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`deleted_at\` datetime(6) NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE \`app_requests\``);
  }
}
