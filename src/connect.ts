import { Socket } from 'net';
import { login } from './login';
import { Connection, NewcamdConnectConfig } from './types';

export const connect = (
  newcamdConnectConfig: NewcamdConnectConfig,
): Promise<Connection> => {
  const socket = new Socket();

  socket.connect({
    host: newcamdConnectConfig.host,
    port: newcamdConnectConfig.port,
  });
  socket.setTimeout(3000);

  return new Promise((resolve, reject) => {
    socket.once('data', (initialMessage) => {
      resolve({
        login: login(
          socket,
          { type: 'initial', body: initialMessage },
          newcamdConnectConfig.desKey,
        ),
        close: () => {
          socket.destroy();
        },
      });
    });

    socket.once('end', () => reject('Unable to connect to Newcamd server'));
    socket.once('timeout', () =>
      reject('Timeout while connecting to Newcamd server'),
    );
  });
};
