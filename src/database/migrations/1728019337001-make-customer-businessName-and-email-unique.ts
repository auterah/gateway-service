import { MigrationInterface, QueryRunner } from 'typeorm';

export class MakeCustomerBusinessNameAndEmailUnique1728019337001
  implements MigrationInterface
{
  name = 'MakeCustomerBusinessNameAndEmailUnique1728019337001';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`customers\` ADD UNIQUE INDEX \`IDX_dc1affdd7ec4feba78a0beb068\` (\`business_name\`)`,
    );
    await queryRunner.query(
      `ALTER TABLE \`customers\` ADD UNIQUE INDEX \`IDX_8536b8b85c06969f84f0c098b0\` (\`email\`)`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`customers\` DROP INDEX \`IDX_8536b8b85c06969f84f0c098b0\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`customers\` DROP INDEX \`IDX_dc1affdd7ec4feba78a0beb068\``,
    );
  }
}
