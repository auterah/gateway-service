import { MigrationInterface, QueryRunner } from "typeorm";

export class AddCostToAppEntity1711188316980 implements MigrationInterface {
    name = 'AddCostToAppEntity1711188316980'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`apps\` ADD \`cost\` varchar(255) NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`apps\` DROP COLUMN \`cost\``);
    }

}
