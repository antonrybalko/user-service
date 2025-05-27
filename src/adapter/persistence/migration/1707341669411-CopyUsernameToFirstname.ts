import { MigrationInterface, QueryRunner } from 'typeorm';

export class CopyUsernameToFirstname1707341669411
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`UPDATE "user" SET "firstname" = "username"`);
  }

  public async down(): Promise<void> {}
}
