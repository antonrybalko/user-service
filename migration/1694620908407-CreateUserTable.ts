import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateUserTable1694620908407 implements MigrationInterface {
    name = 'CreateUserTable1694620908407'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "user" ("id" SERIAL NOT NULL, "guid" uuid NOT NULL, "username" character varying NOT NULL, "password" character varying NOT NULL, "email" character varying, CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "user"`);
    }

}
