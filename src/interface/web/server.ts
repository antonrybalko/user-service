import 'reflect-metadata';
  import { Container } from 'typedi';
import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import morgan from 'morgan';
import 'diconfig';
import { router } from './routes';
import { LoggerInterface } from 'shared/interface/LoggerInterface';

dotenv.config();

const server = express();
const PORT = process.env.APP_PORT || 3000;

const logger: LoggerInterface = Container.get('LoggerInterface');

server.use(express.json());
server.use(cors());
server.use(morgan('tiny'));
server.use(router);

// Return 404 for all other routes
server.use((req: Request, res: Response, next: NextFunction) => {
  res.status(404).json({ error: 'Not Found' });
});

// Error handler
server.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  logger.error(err);
  res.status(500).json({ error: 'Unexpected error' });
});

server.listen(PORT, () => {
  logger.info(`User Service is running on port ${PORT}`);
});
