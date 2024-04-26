import { MigrationInterface, QueryRunner } from 'typeorm';

export class JoinCurrencyToRegionEntity1714093467750
  implements MigrationInterface
{
  name = 'JoinCurrencyToRegionEntity1714093467750';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`regions\` ADD \`currency_id\` varchar(36) NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE \`regions\` ADD CONSTRAINT \`FK_223dce276e8df22d6608430d707\` FOREIGN KEY (\`currency_id\`) REFERENCES \`currencies\`(\`id\`) ON DELETE SET NULL ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`regions\` DROP FOREIGN KEY \`FK_223dce276e8df22d6608430d707\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`regions\` DROP COLUMN \`currency_id\``,
    );
  }
}
