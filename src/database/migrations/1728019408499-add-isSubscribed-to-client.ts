import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddIsSubscribedToClient1728019408499
  implements MigrationInterface
{
  name = 'AddIsSubscribedToClient1728019408499';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`customer_clients\` ADD \`is_subscribed\` tinyint NOT NULL DEFAULT 1`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`customer_clients\` DROP COLUMN \`is_subscribed\``,
    );
  }
}
