import { MigrationInterface, QueryRunner } from 'typeorm';

export class RemoveUniqueFromEmail1728251555867 implements MigrationInterface {
  name = 'RemoveUniqueFromEmail1728251555867';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `DROP INDEX \`IDX_3ed89f7ab9e0cb8b31748a8a85\` ON \`customer_clients\``,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE UNIQUE INDEX \`IDX_3ed89f7ab9e0cb8b31748a8a85\` ON \`customer_clients\` (\`email\`)`,
    );
  }
}
