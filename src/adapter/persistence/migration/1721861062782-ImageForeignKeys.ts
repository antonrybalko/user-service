import { MigrationInterface, QueryRunner } from 'typeorm';

export class ImageForeignKeys1721861062782 implements MigrationInterface {
  name = 'ImageForeignKeys1721861062782';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "user_image" DROP CONSTRAINT "FK_dbd20e1c2b206f640c9f0a4bdd7"`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_image" ADD CONSTRAINT "FK_dbd20e1c2b206f640c9f0a4bdd7" FOREIGN KEY ("userGuid") REFERENCES "user"("guid") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "user_image" DROP CONSTRAINT "FK_dbd20e1c2b206f640c9f0a4bdd7"`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_image" ADD CONSTRAINT "FK_dbd20e1c2b206f640c9f0a4bdd7" FOREIGN KEY ("userGuid") REFERENCES "user"("guid") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }
}
