import 'reflect-metadata';
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import morgan from 'morgan';
import '../../diconfig';
import { router } from './routes';

dotenv.config();

const server = express();
const PORT = process.env.APP_PORT || 3000;

server.use(express.json());
server.use(cors());
server.use(morgan('tiny'));
server.use(router);

server.listen(PORT, () => {
  /* eslint-disable-next-line no-console */
  console.log(`User Service is running on port ${PORT}`);
});
