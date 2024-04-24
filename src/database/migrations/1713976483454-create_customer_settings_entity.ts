import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateCustomerSettingsEntity1713976483454
  implements MigrationInterface
{
  name = 'CreateCustomerSettingsEntity1713976483454';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE \`customer_settings\` (\`id\` varchar(36) NOT NULL, \`logo\` varchar(255) NULL, \`logo_placeholder\` varchar(255) NOT NULL DEFAULT '', \`favicon\` varchar(255) NULL, \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`delete_at\` datetime(6) NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE \`customer_settings\``);
  }
}
