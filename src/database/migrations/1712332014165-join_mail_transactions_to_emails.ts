import { MigrationInterface, QueryRunner } from 'typeorm';

export class JoinMailTransactionsToEmails1712332014165
  implements MigrationInterface
{
  name = 'JoinMailTransactionsToEmails1712332014165';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`mail_transactions\` ADD \`mail_id\` varchar(36) NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE \`emails\` CHANGE \`email\` \`email\` varchar(255) NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE \`mail_transactions\` ADD CONSTRAINT \`FK_d174ee247628d71cf5971011167\` FOREIGN KEY (\`mail_id\`) REFERENCES \`emails\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`mail_transactions\` DROP FOREIGN KEY \`FK_d174ee247628d71cf5971011167\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`emails\` CHANGE \`email\` \`email\` varchar(255) NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE \`mail_transactions\` DROP COLUMN \`mail_id\``,
    );
  }
}
