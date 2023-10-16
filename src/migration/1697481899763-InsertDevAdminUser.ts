import { MigrationInterface, QueryRunner } from "typeorm"
import bcrypt from 'bcrypt';

export class InsertDevAdminUser1697481899763 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        // insert dev admin user if env is dev
        if (process.env.NODE_ENV === 'development') {
            console.log('Inserting dev admin user into database...');
            const password = await bcrypt.hash('admin123', 3)
            await queryRunner.query(`INSERT INTO "user" (username, password, "isAdmin") VALUES ('admin', '${password}', true)`);
        };
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        // delete dev admin user if env is dev
        if (process.env.NODE_ENV === 'development') {
            await queryRunner.query(`DELETE FROM "user" WHERE username = 'admin'`);
        };
    }

}
