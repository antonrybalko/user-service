import 'reflect-metadata';
import { Container } from 'typedi';
import express, { Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import morgan from 'morgan';
import '../../di/diconfig';
import { router } from './routes';
import { LoggerInterface } from 'shared/port/LoggerInterface';
import { JsonValidatorMiddleware } from './middleware/JsonValidatorMiddleware';
import { LoggerInterfaceToken } from 'di/tokens';

dotenv.config();

const server = express();

const logger: LoggerInterface = Container.get(LoggerInterfaceToken);
const jsonValidatorMiddleware = Container.get(JsonValidatorMiddleware);

server.use(express.json());
// JSON error handler must come immediately after express.json()
server.use(jsonValidatorMiddleware.handleJsonError.bind(jsonValidatorMiddleware));
server.use(cors());
server.use(morgan('tiny'));
server.use(router);

// Return 404 for all other routes
server.use((req: Request, res: Response) => {
  res.status(404).json({ error: 'Not Found' });
});

// General error handler
server.use((err: Error, req: Request, res: Response) => {
  logger.error(err);
  res.status(500).json({ error: 'Unexpected error' });
});

export default server;
