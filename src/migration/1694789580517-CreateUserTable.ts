import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateUserTable1694789580517 implements MigrationInterface {
  name = 'CreateUserTable1694789580517';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "user" ("guid" uuid NOT NULL DEFAULT uuid_generate_v4(), "username" character varying NOT NULL, "password" character varying NOT NULL, "email" character varying, CONSTRAINT "PK_61ea3ae73af64f7ce8e9fe55e10" PRIMARY KEY ("guid"))`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "user"`);
  }
}
