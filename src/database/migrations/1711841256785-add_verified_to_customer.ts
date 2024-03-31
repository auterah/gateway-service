import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddVerifiedToCustomer1711841256785 implements MigrationInterface {
  name = 'AddVerifiedToCustomer1711841256785';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`customers\` ADD \`verified\` tinyint NOT NULL DEFAULT 0`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`customers\` DROP COLUMN \`verified\``,
    );
  }
}
