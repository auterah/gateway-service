import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddCustomerIdToCustomerClientsClientTags1714216511792
  implements MigrationInterface
{
  name = 'AddCustomerIdToCustomerClientsClientTags1714216511792';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`customer_clients_client_tags\` DROP FOREIGN KEY \`customer_id\``,
    );
    await queryRunner.query(
      `DROP INDEX \`IDX_f06f46cabaa3bc1923e7b744c9\` ON \`customer_clients_client_tags\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`customer_clients_client_tags\` CHANGE \`customer_id\` \`customer_client_id\` varchar(36) NOT NULL`,
    );
    await queryRunner.query(
      `CREATE INDEX \`IDX_bbff6a5f927a3c3430e7ee1bac\` ON \`customer_clients_client_tags\` (\`customer_client_id\`)`,
    );
    await queryRunner.query(
      `ALTER TABLE \`customer_clients_client_tags\` ADD CONSTRAINT \`FK_bbff6a5f927a3c3430e7ee1bacf\` FOREIGN KEY (\`customer_client_id\`) REFERENCES \`customer_clients\`(\`id\`) ON DELETE CASCADE ON UPDATE CASCADE`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`customer_clients_client_tags\` DROP FOREIGN KEY \`FK_bbff6a5f927a3c3430e7ee1bacf\``,
    );
    await queryRunner.query(
      `DROP INDEX \`IDX_bbff6a5f927a3c3430e7ee1bac\` ON \`customer_clients_client_tags\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`customer_clients_client_tags\` CHANGE \`customer_client_id\` \`customer_id\` varchar(36) NOT NULL`,
    );
    await queryRunner.query(
      `CREATE INDEX \`IDX_f06f46cabaa3bc1923e7b744c9\` ON \`customer_clients_client_tags\` (\`customer_id\`)`,
    );
    await queryRunner.query(
      `ALTER TABLE \`customer_clients_client_tags\` ADD CONSTRAINT \`customer_id\` FOREIGN KEY (\`customer_id\`) REFERENCES \`customer_clients\`(\`id\`) ON DELETE CASCADE ON UPDATE CASCADE`,
    );
  }
}
