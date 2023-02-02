import { Socket } from 'net';
import { login } from './login';
import { Connection, Logger, NewcamdConnectConfig } from './types';

const dummyLogger: Logger = {
  debug: () => {
    /* Nothing to do */
  },
  error: () => {
    /* Nothing to do */
  },
  info: () => {
    /* Nothing to do */
  },
  trace: () => {
    /* Nothing to do */
  },
  warn: () => {
    /* Nothing to do */
  },
};

export const connect = (
  newcamdConnectConfig: NewcamdConnectConfig,
): Promise<Connection> => {
  const logger = newcamdConnectConfig.logger || dummyLogger;
  const socket = new Socket();

  logger.debug(
    `Connecting to Newcamd server ${newcamdConnectConfig.host}:${newcamdConnectConfig.port}`,
  );
  socket.connect(
    {
      host: newcamdConnectConfig.host,
      port: newcamdConnectConfig.port,
    },
    () => {
      logger.debug(
        'Successfully connected to server. Waiting for initial message...',
      );
    },
  );
  socket.setTimeout(10000);

  return new Promise((resolve, reject) => {
    socket.once('data', (initialMessage) => {
      logger.info(
        `Received initial message: ${initialMessage.toString('hex')}`,
      );

      resolve({
        login: login(socket, logger)({ type: 'initial', body: initialMessage }),
        close: () => {
          socket.destroy();
        },
      });
    });

    socket.on('error', () => {
      logger.error('Unable to connect to Newcamd server');
      reject('Unable to connect to Newcamd server');
    });
    socket.once('timeout', () => {
      logger.error('Timeout while reveiving message');
      reject('Timeout while reveiving message');
    });
  });
};
