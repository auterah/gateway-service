import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddedFailedScoreToApp1712619422579 implements MigrationInterface {
  name = 'AddedFailedScoreToApp1712619422579';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`apps\` ADD \`failed_score\` int NOT NULL DEFAULT '0'`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`apps\` DROP COLUMN \`failed_score\``,
    );
  }
}
