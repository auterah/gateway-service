import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddEncryptionkeyToCustomerEntity1714099963894
  implements MigrationInterface
{
  name = 'AddEncryptionkeyToCustomerEntity1714099963894';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`customers\` ADD \`encryption_key\` varchar(255) NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE \`customers\` ADD \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6)`,
    );
    await queryRunner.query(
      `ALTER TABLE \`customers\` ADD \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6)`,
    );
    await queryRunner.query(
      `ALTER TABLE \`customers\` ADD \`deleted_at\` datetime(6) NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE \`customers\` ADD \`version\` int NOT NULL`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`customers\` DROP COLUMN \`version\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`customers\` DROP COLUMN \`deleted_at\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`customers\` DROP COLUMN \`updated_at\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`customers\` DROP COLUMN \`created_at\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`customers\` DROP COLUMN \`encryption_key\``,
    );
  }
}
