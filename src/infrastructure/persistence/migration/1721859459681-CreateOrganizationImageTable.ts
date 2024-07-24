import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateOrganizationImageTable1721859459681
  implements MigrationInterface
{
  name = 'CreateOrganizationImageTable1721859459681';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "organization_image" ("guid" uuid NOT NULL DEFAULT uuid_generate_v4(), "organizationGuid" uuid NOT NULL, "fullUrl" character varying NOT NULL, "mediumUrl" character varying NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_67e00dfd99310a881fcc1f61008" PRIMARY KEY ("guid"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "organization_image" ADD CONSTRAINT "FK_9b009c5981f1e27029c6382809b" FOREIGN KEY ("organizationGuid") REFERENCES "organization"("guid") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "organization_image" DROP CONSTRAINT "FK_9b009c5981f1e27029c6382809b"`,
    );
    await queryRunner.query(`DROP TABLE "organization_image"`);
  }
}
