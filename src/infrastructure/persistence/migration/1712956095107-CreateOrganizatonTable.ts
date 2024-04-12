import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateOrganizatonTable1712956095107 implements MigrationInterface {
  name = 'CreateOrganizatonTable1712956095107';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "organization" ("guid" uuid NOT NULL DEFAULT uuid_generate_v4(), "title" character varying NOT NULL, "cityGuid" uuid NOT NULL, "phoneNumber" character varying NOT NULL, "email" character varying NOT NULL, "registrationNumber" character varying, "status" character varying NOT NULL DEFAULT 'suspended', "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "createdByUserGuid" uuid, CONSTRAINT "PK_daa509c9129c158bef9739000b7" PRIMARY KEY ("guid"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "organization_member" ("guid" uuid NOT NULL DEFAULT uuid_generate_v4(), "userGuid" uuid NOT NULL, "organizationGuid" uuid NOT NULL, "isOrgAdmin" boolean NOT NULL DEFAULT false, CONSTRAINT "organization_member_user_organization" UNIQUE ("userGuid", "organizationGuid"), CONSTRAINT "PK_b875474e38576649cd8125ca0ee" PRIMARY KEY ("guid"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "organization" ADD CONSTRAINT "FK_8b23bdc49de5f8408661dbb8b7f" FOREIGN KEY ("createdByUserGuid") REFERENCES "user"("guid") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "organization_member" ADD CONSTRAINT "FK_c6e64fa2d312180549343d930c2" FOREIGN KEY ("userGuid") REFERENCES "user"("guid") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE "organization_member" ADD CONSTRAINT "FK_8bf055b171887051236a948d22c" FOREIGN KEY ("organizationGuid") REFERENCES "organization"("guid") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "organization_member" DROP CONSTRAINT "FK_8bf055b171887051236a948d22c"`,
    );
    await queryRunner.query(
      `ALTER TABLE "organization_member" DROP CONSTRAINT "FK_c6e64fa2d312180549343d930c2"`,
    );
    await queryRunner.query(
      `ALTER TABLE "organization" DROP CONSTRAINT "FK_8b23bdc49de5f8408661dbb8b7f"`,
    );
    await queryRunner.query(`DROP TABLE "organization_member"`);
    await queryRunner.query(`DROP TABLE "organization"`);
  }
}
