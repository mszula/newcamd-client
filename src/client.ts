import { Socket } from 'net';
import { encrypt } from './crypto/crypto';
import { createLoginKey } from './key/key';
import { getMessage } from './message/login';
import {
  Client,
  InitialMessage,
  NewcamdConnectConfig,
  NewcamdLoginConfig,
} from './types';

export const client = (
  socket: Socket,
  initialMessage: InitialMessage,
  newcamdConnectConfig: NewcamdConnectConfig,
): Client => {
  console.log(initialMessage);

  return {
    login: (newcamdloginConfig: NewcamdLoginConfig) => {
      return new Promise((resolve) => {
        socket.once('data', (data) => {
          console.log(data);

          resolve(true);
        });

        socket.write(
          encrypt(
            getMessage(newcamdloginConfig.username, newcamdloginConfig.password)
              .body,
            createLoginKey(initialMessage, newcamdConnectConfig.desKey).body,
          ),
        );
      });
    },
    close: () => {
      socket.destroy();
    },
  };
};
