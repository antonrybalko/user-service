import Container from 'typedi';
import server from './server';
import { LoggerInterface } from 'shared/interface/LoggerInterface';
import { LoggerInterfaceToken } from 'di/tokens';

const logger: LoggerInterface = Container.get(LoggerInterfaceToken);

const PORT = process.env.APP_PORT || 3000;
server.listen(PORT, () => {
  logger.info(`User Service is running on port ${PORT}`);
});
