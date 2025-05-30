import 'reflect-metadata';
import { DataSource } from 'typeorm';
import dotenv from 'dotenv';
import { UserEntity } from 'adapter/persistence/entity/UserEntity';
import { OrganizationEntity } from './entity/OrganizationEntity';
import { OrganizationMemberEntity } from './entity/OrganizationMemberEntity';
import { UserImageEntity } from './entity/UserImageEntity';
import { OrganizationImageEntity } from './entity/OrganizationImageEntity';

dotenv.config();

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  logging: process.env.NODE_ENV === 'development',
  entities: [
    UserEntity,
    OrganizationEntity,
    OrganizationMemberEntity,
    UserImageEntity,
    OrganizationImageEntity,
  ],
  migrations: ['dist/src/adapter/persistence/migration/*.js'],
});

AppDataSource.initialize()
  .then(async () => {
    // Connection initialized with database...
  })
  /* eslint-disable-next-line no-console */
  .catch((error) => console.log(error));
