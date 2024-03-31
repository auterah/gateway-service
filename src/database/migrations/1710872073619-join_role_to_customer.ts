import { MigrationInterface, QueryRunner } from 'typeorm';

export class JoinRoleToCustomer1710872073619 implements MigrationInterface {
  name = 'JoinRoleToCustomer1710872073619';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`roles\` ADD UNIQUE INDEX \`IDX_ccc7c1489f3a6b3c9b47d4537c\` (\`role\`)`,
    );
    await queryRunner.query(
      `ALTER TABLE \`permissions\` ADD UNIQUE INDEX \`IDX_1c1e0637ecf1f6401beb9a68ab\` (\`action\`)`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`permissions\` DROP INDEX \`IDX_1c1e0637ecf1f6401beb9a68ab\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`roles\` DROP INDEX \`IDX_ccc7c1489f3a6b3c9b47d4537c\``,
    );
  }
}
