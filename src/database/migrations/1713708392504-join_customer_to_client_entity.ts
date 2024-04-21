import { MigrationInterface, QueryRunner } from 'typeorm';

export class JoinCustomerToClientEntity1713708392504
  implements MigrationInterface
{
  name = 'JoinCustomerToClientEntity1713708392504';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`clients\` ADD \`customer_id\` varchar(36) NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE \`clients\` ADD CONSTRAINT \`FK_98715bcf5d0bd51e568481d5ae4\` FOREIGN KEY (\`customer_id\`) REFERENCES \`customers\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`clients\` DROP FOREIGN KEY \`FK_98715bcf5d0bd51e568481d5ae4\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`clients\` DROP COLUMN \`customer_id\``,
    );
  }
}
