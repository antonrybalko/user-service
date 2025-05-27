import { MigrationInterface, QueryRunner } from 'typeorm';

export class OrganizationAlterStatus1719698886559
  implements MigrationInterface
{
  name = 'OrganizationAlterStatus1719698886559';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "organization" DROP COLUMN "status"`);
    await queryRunner.query(
      `ALTER TABLE "organization" ADD "status" integer NOT NULL DEFAULT 1`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "organization" DROP COLUMN "status"`);
    await queryRunner.query(
      `ALTER TABLE "organization" ADD "status" character varying NOT NULL DEFAULT 'BLOCKED'`,
    );
  }
}
