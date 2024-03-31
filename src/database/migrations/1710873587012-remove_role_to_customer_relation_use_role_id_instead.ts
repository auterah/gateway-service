import { MigrationInterface, QueryRunner } from 'typeorm';

export class RemoveRoleToCustomerRelationUseRoleIdInstead1710873587012
  implements MigrationInterface
{
  name = 'RemoveRoleToCustomerRelationUseRoleIdInstead1710873587012';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`customers\` ADD \`role_id\` varchar(255) NOT NULL`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`customers\` DROP COLUMN \`role_id\``,
    );
  }
}
