import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateLoginSessionEntity1715213184439
  implements MigrationInterface
{
  name = 'CreateLoginSessionEntity1715213184439';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE \`login_sessions\` (\`id\` varchar(36) NOT NULL, \`customer_id\` varchar(255) NOT NULL, \`location\` varchar(255) NULL, \`ip_address\` varchar(255) NULL, \`user_agent\` varchar(255) NULL, \`device_type\` varchar(255) NULL, \`status\` tinyint NOT NULL DEFAULT 1, \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`delete_at\` datetime(6) NULL, \`version\` int NOT NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE \`login_sessions\``);
  }
}
