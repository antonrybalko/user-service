import { MigrationInterface, QueryRunner } from "typeorm";

export class AlterUserTable1694795053360 implements MigrationInterface {
    name = 'AlterUserTable1694795053360'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" ADD "oauthProvider" character varying`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "oauthProvider"`);
    }

}
