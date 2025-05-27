import { MigrationInterface, QueryRunner } from 'typeorm';

export class OrganizationAddDescription1719707633548
  implements MigrationInterface
{
  name = 'OrganizationAddDescription1719707633548';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "organization" ADD "description" character varying(1000)`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "organization" DROP COLUMN "description"`,
    );
  }
}
