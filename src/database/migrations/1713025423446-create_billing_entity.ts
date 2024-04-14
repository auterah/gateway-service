import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateBillingEntity1713025423446 implements MigrationInterface {
  name = 'CreateBillingEntity1713025423446';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE \`billings\` (\`id\` varchar(36) NOT NULL, \`customer_id\` varchar(255) NOT NULL, \`payment_method\` enum ('Transfer') NOT NULL DEFAULT 'Transfer', \`amount\` decimal(10,2) NOT NULL DEFAULT '0.00', \`bill_at\` datetime(6) NOT NULL COMMENT 'BillAt AKA end/charge date' DEFAULT CURRENT_TIMESTAMP(6), \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE \`billings\``);
  }
}
