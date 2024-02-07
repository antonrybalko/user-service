import { MigrationInterface, QueryRunner } from 'typeorm';

export class ChangeFirstnameNotNull1707341862341 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "user" ALTER COLUMN "firstname" SET NOT NULL`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "user" ALTER COLUMN "firstname" DROP NOT NULL`,
    );
  }
}
