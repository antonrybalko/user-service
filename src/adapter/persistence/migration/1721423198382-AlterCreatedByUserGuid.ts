import { MigrationInterface, QueryRunner } from 'typeorm';

export class AlterCreatedByUserGuid1721423198382 implements MigrationInterface {
  name = 'AlterCreatedByUserGuid1721423198382';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "organization" DROP CONSTRAINT "FK_8b23bdc49de5f8408661dbb8b7f"`,
    );
    await queryRunner.query(
      `ALTER TABLE "organization" ALTER COLUMN "createdByUserGuid" SET NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "organization" ADD CONSTRAINT "FK_8b23bdc49de5f8408661dbb8b7f" FOREIGN KEY ("createdByUserGuid") REFERENCES "user"("guid") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "organization" DROP CONSTRAINT "FK_8b23bdc49de5f8408661dbb8b7f"`,
    );
    await queryRunner.query(
      `ALTER TABLE "organization" ALTER COLUMN "createdByUserGuid" DROP NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "organization" ADD CONSTRAINT "FK_8b23bdc49de5f8408661dbb8b7f" FOREIGN KEY ("createdByUserGuid") REFERENCES "user"("guid") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }
}
