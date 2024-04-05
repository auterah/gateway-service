import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateSettingEntity1711703984668 implements MigrationInterface {
  name = 'CreateSettingEntity1711703984668';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE \`settings\` (\`id\` int NOT NULL AUTO_INCREMENT, \`skey\` varchar(255) NOT NULL, \`value\` varchar(255) NOT NULL, \`type\` varchar(255) NOT NULL, \`name\` varchar(255) NOT NULL, \`length\` varchar(255) NOT NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE \`settings\``);
  }
}
