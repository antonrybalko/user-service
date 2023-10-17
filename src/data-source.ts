import 'reflect-metadata';
import { DataSource } from 'typeorm';
import dotenv from 'dotenv';
import { User } from './entity/User';

dotenv.config();

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  logging: process.env.NODE_ENV === 'development',
  entities: [User],
  migrations: ['dist/migration/*.js'],
});

AppDataSource.initialize()
  .then(() => {
    // here you can start to work with your database
  })
  /* eslint-disable-next-line no-console */
  .catch((error) => console.log(error));
