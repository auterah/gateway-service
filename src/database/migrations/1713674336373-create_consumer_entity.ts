import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateConsumerEntity1713674336373 implements MigrationInterface {
  name = 'CreateConsumerEntity1713674336373';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE \`consumers\` (\`id\` varchar(36) NOT NULL, \`name\` varchar(255) NULL, \`email\` varchar(255) NOT NULL, \`tags\` json NOT NULL, \`verified\` tinyint NOT NULL DEFAULT 0, \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`delete_at\` datetime(6) NULL, UNIQUE INDEX \`IDX_e69daa93630520b15bada5e1e9\` (\`email\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `DROP INDEX \`IDX_e69daa93630520b15bada5e1e9\` ON \`consumers\``,
    );
    await queryRunner.query(`DROP TABLE \`consumers\``);
  }
}
