import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddSentScoreToApp1711605767278 implements MigrationInterface {
  name = 'AddSentScoreToApp1711605767278';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`apps\` ADD \`sent_score\` int NOT NULL DEFAULT '0'`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE \`apps\` DROP COLUMN \`sent_score\``);
  }
}
