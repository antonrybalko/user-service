import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateRefreshTokenTable1735000000000 implements MigrationInterface {
  name = 'CreateRefreshTokenTable1735000000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "refresh_token" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(), 
        "token" character varying NOT NULL, 
        "userGuid" uuid NOT NULL, 
        "expiresAt" TIMESTAMP NOT NULL, 
        "isRevoked" boolean NOT NULL DEFAULT false, 
        "family" character varying NOT NULL,
        "createdAt" TIMESTAMP NOT NULL DEFAULT now(), 
        "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), 
        CONSTRAINT "PK_refresh_token_id" PRIMARY KEY ("id"),
        CONSTRAINT "UQ_refresh_token_token" UNIQUE ("token"),
        CONSTRAINT "FK_refresh_token_user" FOREIGN KEY ("userGuid") REFERENCES "user"("guid") ON DELETE CASCADE
      )`,
    );

    // Create indexes
    await queryRunner.query(`CREATE INDEX "IDX_refresh_token_token" ON "refresh_token" ("token")`);
    await queryRunner.query(`CREATE INDEX "IDX_refresh_token_userGuid" ON "refresh_token" ("userGuid")`);
    await queryRunner.query(`CREATE INDEX "IDX_refresh_token_family" ON "refresh_token" ("family")`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Drop indexes
    await queryRunner.query(`DROP INDEX "IDX_refresh_token_family"`);
    await queryRunner.query(`DROP INDEX "IDX_refresh_token_userGuid"`);
    await queryRunner.query(`DROP INDEX "IDX_refresh_token_token"`);
    
    // Drop table
    await queryRunner.query(`DROP TABLE "refresh_token"`);
  }
}
