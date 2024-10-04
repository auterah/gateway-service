import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddDomainToApp1728042898958 implements MigrationInterface {
  name = 'AddDomainToApp1728042898958';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`apps\` ADD \`domain\` varchar(255) NULL`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE \`apps\` DROP COLUMN \`domain\``);
  }
}
