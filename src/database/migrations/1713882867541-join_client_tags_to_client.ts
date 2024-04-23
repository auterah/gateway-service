import { MigrationInterface, QueryRunner } from 'typeorm';

export class JoinClientTagsToClient1713882867541 implements MigrationInterface {
  name = 'JoinClientTagsToClient1713882867541';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`customer_clients\` DROP COLUMN \`tags\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`client_tags\` DROP FOREIGN KEY \`FK_752a22b36bfb68184764c845c11\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`client_tags\` DROP COLUMN \`customer_id\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`client_tags\` ADD \`customer_id\` varchar(255) NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE \`client_tags\` ADD CONSTRAINT \`FK_752a22b36bfb68184764c845c11\` FOREIGN KEY (\`customer_id\`) REFERENCES \`customers\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`client_tags\` DROP FOREIGN KEY \`FK_752a22b36bfb68184764c845c11\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`client_tags\` DROP COLUMN \`customer_id\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`client_tags\` ADD \`customer_id\` varchar(36) NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE \`client_tags\` ADD CONSTRAINT \`FK_752a22b36bfb68184764c845c11\` FOREIGN KEY (\`customer_id\`) REFERENCES \`customers\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`customer_clients\` ADD \`tags\` json NOT NULL`,
    );
  }
}
