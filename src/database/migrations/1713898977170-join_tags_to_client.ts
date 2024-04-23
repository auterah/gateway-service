import { MigrationInterface, QueryRunner } from 'typeorm';

export class JoinTagsToClient1713898977170 implements MigrationInterface {
  name = 'JoinTagsToClient1713898977170';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`client_tags\` ADD \`client_id\` varchar(36) NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE \`client_tags\` ADD CONSTRAINT \`FK_752a22b36bfb68184764c845c11\` FOREIGN KEY (\`customer_id\`) REFERENCES \`customers\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`client_tags\` ADD CONSTRAINT \`FK_32e80c0dae4fc149b834efd79a9\` FOREIGN KEY (\`client_id\`) REFERENCES \`customer_clients\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`client_tags\` DROP FOREIGN KEY \`FK_32e80c0dae4fc149b834efd79a9\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`client_tags\` DROP FOREIGN KEY \`FK_752a22b36bfb68184764c845c11\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`client_tags\` DROP COLUMN \`client_id\``,
    );
  }
}
