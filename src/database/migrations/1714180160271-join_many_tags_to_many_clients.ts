import { MigrationInterface, QueryRunner } from 'typeorm';

export class JoinManyTagsToManyClients1714180160271
  implements MigrationInterface
{
  name = 'JoinManyTagsToManyClients1714180160271';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE \`customer_clients_client_tags\` (\`customer_client_id\` varchar(36) NOT NULL, \`client_tag_id\` varchar(36) NOT NULL, INDEX \`IDX_bbff6a5f927a3c3430e7ee1bac\` (\`customer_client_id\`), INDEX \`IDX_8dbf722837d1e2bf2e9c617cb0\` (\`client_tag_id\`), PRIMARY KEY (\`customer_client_id\`, \`client_tag_id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `ALTER TABLE \`customer_clients_client_tags\` ADD CONSTRAINT \`FK_bbff6a5f927a3c3430e7ee1bacf\` FOREIGN KEY (\`customer_client_id\`) REFERENCES \`customer_clients\`(\`id\`) ON DELETE CASCADE ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE \`customer_clients_client_tags\` ADD CONSTRAINT \`FK_8dbf722837d1e2bf2e9c617cb0d\` FOREIGN KEY (\`client_tag_id\`) REFERENCES \`client_tags\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`customer_clients_client_tags\` DROP FOREIGN KEY \`FK_8dbf722837d1e2bf2e9c617cb0d\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`customer_clients_client_tags\` DROP FOREIGN KEY \`FK_bbff6a5f927a3c3430e7ee1bacf\``,
    );
    await queryRunner.query(
      `DROP INDEX \`IDX_8dbf722837d1e2bf2e9c617cb0\` ON \`customer_clients_client_tags\``,
    );
    await queryRunner.query(
      `DROP INDEX \`IDX_bbff6a5f927a3c3430e7ee1bac\` ON \`customer_clients_client_tags\``,
    );
    await queryRunner.query(`DROP TABLE \`customer_clients_client_tags\``);
  }
}
