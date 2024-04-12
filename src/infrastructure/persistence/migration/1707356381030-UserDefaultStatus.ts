import { MigrationInterface, QueryRunner } from 'typeorm';

export class UserDefaultStatus1707356381030 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "user" ALTER COLUMN "status" SET DEFAULT '1'`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "user" ALTER COLUMN "status" SET DEFAULT '0'`,
    );
  }
}
