import Container from 'typedi';
import server from './server';
import { LoggerInterface } from 'shared/port/LoggerInterface';
import { LoggerInterfaceToken } from 'di/tokens';
import { AppDataSource } from 'adapter/persistence/data-source';

const logger: LoggerInterface = Container.get(LoggerInterfaceToken);

const PORT = process.env.APP_PORT || 3000;

AppDataSource.initialize()
  .then(async () => {
    server.listen(PORT, () => {
      logger.info(`User Service is running on port ${PORT}`);
    });
  })
  /* eslint-disable-next-line no-console */
  .catch((error) => console.log(error));

