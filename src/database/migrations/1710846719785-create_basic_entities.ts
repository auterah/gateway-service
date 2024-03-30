import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateBasicEntities1710846719785 implements MigrationInterface {
  name = 'CreateBasicEntities1710846719785';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE \`apps\` (\`id\` varchar(36) NOT NULL, \`name\` varchar(255) NOT NULL, \`private_key\` varchar(255) NOT NULL, \`public_key\` varchar(255) NOT NULL, \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`customer_id\` varchar(36) NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`customers\` (\`id\` varchar(36) NOT NULL, \`first_name\` varchar(255) NOT NULL, \`last_name\` varchar(255) NOT NULL, \`email\` varchar(255) NOT NULL, \`password\` varchar(255) NOT NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`emails\` (\`id\` varchar(36) NOT NULL, \`recipient_name\` varchar(255) NULL, \`email\` varchar(255) NOT NULL, \`html\` varchar(255) NOT NULL, \`subject\` varchar(255) NOT NULL, \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `ALTER TABLE \`apps\` ADD CONSTRAINT \`FK_f4b9b3305c7c4c7020421ecd730\` FOREIGN KEY (\`customer_id\`) REFERENCES \`customers\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`apps\` DROP FOREIGN KEY \`FK_f4b9b3305c7c4c7020421ecd730\``,
    );
    await queryRunner.query(`DROP TABLE \`emails\``);
    await queryRunner.query(`DROP TABLE \`customers\``);
    await queryRunner.query(`DROP TABLE \`apps\``);
  }
}
