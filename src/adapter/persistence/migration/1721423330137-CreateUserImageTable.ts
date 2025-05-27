import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateUserImageTable1721423330137 implements MigrationInterface {
  name = 'CreateUserImageTable1721423330137';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "user_image" ("guid" uuid NOT NULL DEFAULT uuid_generate_v4(), "userGuid" uuid NOT NULL, "fullUrl" character varying NOT NULL, "mediumUrl" character varying NOT NULL, "smallUrl" character varying NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_2df57c0deb2eb021aef37857972" PRIMARY KEY ("guid"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_image" ADD CONSTRAINT "FK_dbd20e1c2b206f640c9f0a4bdd7" FOREIGN KEY ("userGuid") REFERENCES "user"("guid") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "user_image" DROP CONSTRAINT "FK_dbd20e1c2b206f640c9f0a4bdd7"`,
    );
    await queryRunner.query(`DROP TABLE "user_image"`);
  }
}
