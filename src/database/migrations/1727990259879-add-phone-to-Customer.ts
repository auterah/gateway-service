import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddPhoneToCustomer1727990259879 implements MigrationInterface {
  name = 'AddPhoneToCustomer1727990259879';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`customers\` ADD \`phone\` varchar(255) NOT NULL`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE \`customers\` DROP COLUMN \`phone\``);
  }
}
