import { MigrationInterface, QueryRunner } from 'typeorm';

export class ChangeAppCostTypeToNumber1711318862332
  implements MigrationInterface
{
  name = 'ChangeAppCostTypeToNumber1711318862332';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE \`apps\` DROP COLUMN \`cost\``);
    await queryRunner.query(
      `ALTER TABLE \`apps\` ADD \`cost\` decimal(10,2) NOT NULL DEFAULT '0.00'`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE \`apps\` DROP COLUMN \`cost\``);
    await queryRunner.query(
      `ALTER TABLE \`apps\` ADD \`cost\` varchar(255) NOT NULL`,
    );
  }
}
