import { MigrationInterface, QueryRunner } from 'typeorm';

export class RenamePhoneNumberToPhone1719702520995
  implements MigrationInterface
{
  name = 'RenamePhoneNumberToPhone1719702520995';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "user" RENAME COLUMN "phoneNumber" TO "phone"`,
    );
    await queryRunner.query(
      `ALTER TABLE "organization" RENAME COLUMN "phoneNumber" TO "phone"`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "user" RENAME COLUMN "phone" TO "phoneNumber"`,
    );
    await queryRunner.query(
      `ALTER TABLE "organization" RENAME COLUMN "phone" TO "phoneNumber"`,
    );
  }
}
