import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateBillingPlanEntity1712639508366
  implements MigrationInterface
{
  name = 'CreateBillingPlanEntity1712639508366';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE \`billing_plans\` (\`id\` varchar(36) NOT NULL, \`name\` varchar(255) NOT NULL, \`type\` enum ('Freemium', 'Premium') NOT NULL DEFAULT 'Freemium', \`active\` tinyint NOT NULL DEFAULT 1, \`billing_cycle\` int NOT NULL DEFAULT '1', PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE \`billing_plans\``);
  }
}
