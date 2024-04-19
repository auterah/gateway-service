import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateBillingThresholdEntity1713542053110
  implements MigrationInterface
{
  name = 'CreateBillingThresholdEntity1713542053110';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE \`billing_thresholds\` (\`id\` varchar(36) NOT NULL, \`name\` varchar(255) NOT NULL, \`cost\` decimal(10,2) NOT NULL DEFAULT '0.00', \`threshold\` int NOT NULL DEFAULT '0', \`active\` tinyint NOT NULL DEFAULT 1, \`comment\` varchar(255) NOT NULL, \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`deleted_at\` datetime(6) NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE \`billing_thresholds\``);
  }
}
