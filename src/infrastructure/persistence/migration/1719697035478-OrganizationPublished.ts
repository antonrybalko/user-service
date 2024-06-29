import { MigrationInterface, QueryRunner } from 'typeorm';

export class OrganizationPublished1719697035478 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "organization" ADD "published" boolean NOT NULL DEFAULT false`,
    );
    await queryRunner.query(`UPDATE "organization" SET "published" = true`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "organization" DROP COLUMN "published"`,
    );
  }
}
