import { MigrationInterface, QueryRunner } from 'typeorm';

export class MakeCommentNullableInBillingThresholdEntity1713553804017
  implements MigrationInterface
{
  name = 'MakeCommentNullableInBillingThresholdEntity1713553804017';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`billing_thresholds\` CHANGE \`comment\` \`comment\` varchar(255) NULL`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`billing_thresholds\` CHANGE \`comment\` \`comment\` varchar(255) NOT NULL`,
    );
  }
}