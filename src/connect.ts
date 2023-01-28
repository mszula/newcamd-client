import { Socket } from 'net';
import { client } from './client';
import { Client, NewcamdConnectConfig } from './types';

export const connect = (
  newcamdConnectConfig: NewcamdConnectConfig,
): Promise<Client> => {
  const socket = new Socket();

  socket.connect({
    host: newcamdConnectConfig.host,
    port: newcamdConnectConfig.port,
  });
  socket.setTimeout(3000);

  return new Promise((resolve, reject) => {
    socket.once('data', (initialMessage) => {
      resolve(
        client(
          socket,
          { type: 'initial', body: initialMessage },
          newcamdConnectConfig,
        ),
      );
    });

    socket.once('end', () => reject('Unable to connect to Newcamd server'));
    socket.once('timeout', () =>
      reject('Timeout while connecting to Newcamd server'),
    );
  });
};

connect({
  host: '127.0.0.1',
  port: 1234,
  desKey: '0102030405060708091011121314',
}).then((client) => {
  client
    .login({ username: 'test', password: 'test' })
    .then((a) => client.close());
});
