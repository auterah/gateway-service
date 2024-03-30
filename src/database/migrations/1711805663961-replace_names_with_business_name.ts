import { MigrationInterface, QueryRunner } from "typeorm";

export class ReplaceNamesWithBusinessName1711805663961 implements MigrationInterface {
    name = 'ReplaceNamesWithBusinessName1711805663961'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`customers\` DROP COLUMN \`first_name\``);
        await queryRunner.query(`ALTER TABLE \`customers\` DROP COLUMN \`last_name\``);
        await queryRunner.query(`ALTER TABLE \`customers\` ADD \`business_name\` varchar(255) NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`customers\` DROP COLUMN \`business_name\``);
        await queryRunner.query(`ALTER TABLE \`customers\` ADD \`last_name\` varchar(255) NULL`);
        await queryRunner.query(`ALTER TABLE \`customers\` ADD \`first_name\` varchar(255) NULL`);
    }

}
