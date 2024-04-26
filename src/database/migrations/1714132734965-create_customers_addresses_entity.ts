import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateCustomersAddressesEntity1714132734965
  implements MigrationInterface
{
  name = 'CreateCustomersAddressesEntity1714132734965';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE \`customers_addresses\` (\`id\` varchar(36) NOT NULL, \`city\` varchar(255) NULL, \`office_code\` varchar(255) NULL, \`street\` varchar(255) NULL, \`postal_code\` varchar(255) NULL, \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`delete_at\` datetime(6) NULL, \`version\` int NOT NULL, \`customer_id\` varchar(36) NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `ALTER TABLE \`customers_addresses\` ADD CONSTRAINT \`FK_833ee78b6523b7eebd8734b2a51\` FOREIGN KEY (\`customer_id\`) REFERENCES \`customers\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`customers_addresses\` DROP FOREIGN KEY \`FK_833ee78b6523b7eebd8734b2a51\``,
    );
    await queryRunner.query(`DROP TABLE \`customers_addresses\``);
  }
}
