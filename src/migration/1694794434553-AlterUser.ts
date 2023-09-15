import { MigrationInterface, QueryRunner } from "typeorm";

export class AlterUser1694794434553 implements MigrationInterface {
    name = 'AlterUser1694794434553'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" ADD "phoneNumber" character varying`);
        await queryRunner.query(`ALTER TABLE "user" ADD CONSTRAINT "UQ_f2578043e491921209f5dadd080" UNIQUE ("phoneNumber")`);
        await queryRunner.query(`ALTER TABLE "user" ADD "vkId" character varying`);
        await queryRunner.query(`ALTER TABLE "user" ADD "googleId" character varying`);
        await queryRunner.query(`ALTER TABLE "user" ADD CONSTRAINT "UQ_e12875dfb3b1d92d7d7c5377e22" UNIQUE ("email")`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" DROP CONSTRAINT "UQ_e12875dfb3b1d92d7d7c5377e22"`);
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "googleId"`);
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "vkId"`);
        await queryRunner.query(`ALTER TABLE "user" DROP CONSTRAINT "UQ_f2578043e491921209f5dadd080"`);
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "phoneNumber"`);
    }

}
