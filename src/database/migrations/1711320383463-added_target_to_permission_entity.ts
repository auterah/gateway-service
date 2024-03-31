import { MigrationInterface, QueryRunner } from "typeorm";

export class AddedTargetToPermissionEntity1711320383463 implements MigrationInterface {
    name = 'AddedTargetToPermissionEntity1711320383463'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`permissions\` ADD \`target\` varchar(255) NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`permissions\` DROP COLUMN \`target\``);
    }

}
