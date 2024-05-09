import { MigrationInterface, QueryRunner } from 'typeorm';

export class JoinCustomerToLoginSessionsEntity1715213359018
  implements MigrationInterface
{
  name = 'JoinCustomerToLoginSessionsEntity1715213359018';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`login_sessions\` ADD CONSTRAINT \`FK_a38a4a16337814f8497e09c1686\` FOREIGN KEY (\`customer_id\`) REFERENCES \`customers\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`login_sessions\` DROP FOREIGN KEY \`FK_a38a4a16337814f8497e09c1686\``,
    );
  }
}
