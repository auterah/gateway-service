import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddedRegionIdCustomersAddressesEntity1714142879940
  implements MigrationInterface
{
  name = 'AddedRegionIdCustomersAddressesEntity1714142879940';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`customers_addresses\` ADD \`region_id\` varchar(255) NULL`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`customers_addresses\` DROP COLUMN \`region_id\``,
    );
  }
}
