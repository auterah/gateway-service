import { MigrationInterface, QueryRunner } from "typeorm";

export class AddCustomerIdToCustomerSettingsEntity1713978332220 implements MigrationInterface {
    name = 'AddCustomerIdToCustomerSettingsEntity1713978332220'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`customer_settings\` ADD \`customer_id\` varchar(255) NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`customer_settings\` DROP COLUMN \`customer_id\``);
    }

}
