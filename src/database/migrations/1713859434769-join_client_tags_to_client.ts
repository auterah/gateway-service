import { MigrationInterface, QueryRunner } from "typeorm";

export class JoinClientTagsToClient1713859434769 implements MigrationInterface {
    name = 'JoinClientTagsToClient1713859434769'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`mail_transactions\` DROP FOREIGN KEY \`FK_d174ee247628d71cf5971011167\``);
        await queryRunner.query(`ALTER TABLE \`customer_clients\` DROP COLUMN \`tags\``);
        await queryRunner.query(`ALTER TABLE \`emails\` DROP COLUMN \`html\``);
        await queryRunner.query(`ALTER TABLE \`emails\` ADD \`html\` varchar(255) NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`mail_transactions\` ADD CONSTRAINT \`FK_9dff10ba2e450434e55af92168f\` FOREIGN KEY (\`mail_id\`) REFERENCES \`emails\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`mail_transactions\` DROP FOREIGN KEY \`FK_9dff10ba2e450434e55af92168f\``);
        await queryRunner.query(`ALTER TABLE \`emails\` DROP COLUMN \`html\``);
        await queryRunner.query(`ALTER TABLE \`emails\` ADD \`html\` longtext NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`customer_clients\` ADD \`tags\` json NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`mail_transactions\` ADD CONSTRAINT \`FK_d174ee247628d71cf5971011167\` FOREIGN KEY (\`mail_id\`) REFERENCES \`emails\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
