import { MigrationInterface, QueryRunner } from 'typeorm';

export class RenameClientsToCustomerClients1713767280720
  implements MigrationInterface
{
  name = 'RenameClientsToCustomerClients1713767280720';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `DROP INDEX \`IDX_b48860677afe62cd96e1265948\` ON \`clients\``,
    );
    await queryRunner.query(`DROP TABLE \`clients\``);
    await queryRunner.query(
      `CREATE TABLE \`customer_clients\` (\`id\` varchar(36) NOT NULL, \`name\` varchar(255) NULL, \`email\` varchar(255) NOT NULL, \`tags\` json NOT NULL, \`customer_id\` varchar(255) NOT NULL, \`verified\` tinyint NOT NULL DEFAULT 0, \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`delete_at\` datetime(6) NULL, UNIQUE INDEX \`IDX_3ed89f7ab9e0cb8b31748a8a85\` (\`email\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `ALTER TABLE \`customer_clients\` ADD CONSTRAINT \`FK_b3de1105f2e15087c916ace6f50\` FOREIGN KEY (\`customer_id\`) REFERENCES \`customers\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`customer_clients\` DROP FOREIGN KEY \`FK_b3de1105f2e15087c916ace6f50\``,
    );
    await queryRunner.query(
      `DROP INDEX \`IDX_3ed89f7ab9e0cb8b31748a8a85\` ON \`customer_clients\``,
    );
    await queryRunner.query(`DROP TABLE \`customer_clients\``);
  }
}
