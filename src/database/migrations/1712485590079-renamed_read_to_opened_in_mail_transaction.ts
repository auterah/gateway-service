import { MigrationInterface, QueryRunner } from 'typeorm';

export class RenamedReadToOpenedInMailTransaction1712485590079
  implements MigrationInterface
{
  name = 'RenamedReadToOpenedInMailTransaction1712485590079';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`mail_transactions\` CHANGE \`read\` \`opened\` tinyint NOT NULL DEFAULT '0'`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`mail_transactions\` CHANGE \`opened\` \`read\` tinyint NOT NULL DEFAULT '0'`,
    );
  }
}
