import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateTargetEntity1712480612105 implements MigrationInterface {
  name = 'CreateTargetEntity1712480612105';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE \`targets\` (\`id\` int NOT NULL AUTO_INCREMENT, \`target\` varchar(255) NOT NULL, \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE \`targets\``);
  }
}
