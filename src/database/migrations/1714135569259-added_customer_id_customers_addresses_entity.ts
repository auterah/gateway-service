import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddedCustomerIdCustomersAddressesEntity1714135569259
  implements MigrationInterface
{
  name = 'AddedCustomerIdCustomersAddressesEntity1714135569259';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`customers_addresses\` DROP FOREIGN KEY \`FK_833ee78b6523b7eebd8734b2a51\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`customers_addresses\` DROP COLUMN \`customer_id\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`customers_addresses\` ADD \`customer_id\` varchar(255) NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE \`customers_addresses\` ADD CONSTRAINT \`FK_833ee78b6523b7eebd8734b2a51\` FOREIGN KEY (\`customer_id\`) REFERENCES \`customers\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`customers_addresses\` DROP FOREIGN KEY \`FK_833ee78b6523b7eebd8734b2a51\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`customers_addresses\` DROP COLUMN \`customer_id\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`customers_addresses\` ADD \`customer_id\` varchar(36) NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE \`customers_addresses\` ADD CONSTRAINT \`FK_833ee78b6523b7eebd8734b2a51\` FOREIGN KEY (\`customer_id\`) REFERENCES \`customers\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }
}
