import 'reflect-metadata';
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import morgan from 'morgan';
import './diconfig';
import { router } from './routes';

dotenv.config();

const app = express();
const PORT = process.env.APP_PORT || 3000;

app.use(express.json());
app.use(cors());
app.use(morgan('tiny'));
app.use(router);

app.listen(PORT, () => {
  /* eslint-disable-next-line no-console */
  console.log(`User Service is running on port ${PORT}`);
});
