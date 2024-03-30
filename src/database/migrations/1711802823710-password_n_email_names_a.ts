import { MigrationInterface, QueryRunner } from "typeorm";

export class PasswordNEmailNamesA1711802823710 implements MigrationInterface {
    name = 'PasswordNEmailNamesA1711802823710'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`customers\` CHANGE \`first_name\` \`first_name\` varchar(255) NULL`);
        await queryRunner.query(`ALTER TABLE \`customers\` CHANGE \`last_name\` \`last_name\` varchar(255) NULL`);
        await queryRunner.query(`ALTER TABLE \`customers\` CHANGE \`email\` \`email\` varchar(255) NULL`);
        await queryRunner.query(`ALTER TABLE \`customers\` CHANGE \`password\` \`password\` varchar(255) NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`customers\` CHANGE \`password\` \`password\` varchar(255) NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`customers\` CHANGE \`email\` \`email\` varchar(255) NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`customers\` CHANGE \`last_name\` \`last_name\` varchar(255) NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`customers\` CHANGE \`first_name\` \`first_name\` varchar(255) NOT NULL`);
    }

}
