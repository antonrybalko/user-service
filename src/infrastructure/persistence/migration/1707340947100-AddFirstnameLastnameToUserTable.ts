import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddFirstnameLastnameToUserTable1707340947100
  implements MigrationInterface
{
  name = 'AddFirstnameLastnameToUserTable1707340947100';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "user" ADD "firstname" character varying`,
    );
    await queryRunner.query(
      `ALTER TABLE "user" ADD "lastname" character varying`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "lastname"`);
    await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "firstname"`);
  }
}
