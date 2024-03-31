import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddOtpToCustomer1711839812774 implements MigrationInterface {
  name = 'AddOtpToCustomer1711839812774';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE \`customers\` ADD \`otp\` int NULL`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE \`customers\` DROP COLUMN \`otp\``);
  }
}
