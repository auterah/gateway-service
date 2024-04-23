import { MigrationInterface, QueryRunner } from 'typeorm';

export class JoinClientTagsToCustomer1713859300353
  implements MigrationInterface
{
  name = 'JoinClientTagsToCustomer1713859300353';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`client_tags\` ADD \`customer_id\` varchar(36) NULL`,
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
  }
}
