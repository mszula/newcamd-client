import { Socket } from 'net';
import { getClient } from './client';
import { decrypt, encrypt } from './crypto/crypto';
import { createLoginKey } from './key/key';
import { getMessage } from './message/login';
import {
  Client,
  InitialMessage,
  NewcamdConnectConfig,
  NewcamdLoginConfig,
} from './types';

export const login =
  (
    socket: Socket,
    initialMessage: InitialMessage,
    desKey: NewcamdConnectConfig['desKey'],
  ) =>
  ({ username, password }: NewcamdLoginConfig): Promise<Client> =>
    new Promise((resolve, reject) => {
      const loginKey = createLoginKey(initialMessage, desKey);
      socket.once('data', (data) => {
        const loginResponse = decrypt(data, loginKey);
        if (checkLoginResponse(loginResponse)) {
          resolve(getClient(socket, password, desKey));
        }

        reject('Wrong username or password');
      });

      socket.write(encrypt(getMessage(username, password).body, loginKey));
    });

const checkLoginResponse = (response: Buffer): boolean => {
  if (response.toString('hex', 0, 1) === 'e1') {
    return true;
  }
};
