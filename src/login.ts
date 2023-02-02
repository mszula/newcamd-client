import { Socket } from 'net';
import { getClient } from './client';
import { decrypt, encrypt } from './crypto/crypto';
import { createLoginKey } from './key/key';
import { getMessage } from './message/login';
import { Client, InitialMessage, Logger, NewcamdLoginConfig } from './types';

let client: Client = null;

export const login =
  (socket: Socket, logger: Logger) =>
  (initialMessage: InitialMessage) =>
  ({ username, password, desKey }: NewcamdLoginConfig): Promise<Client> =>
    new Promise((resolve, reject) => {
      if (client) {
        resolve(client);
      }

      logger.debug(`Trying to log in using ${username} and given password...`);
      const loginKey = createLoginKey(initialMessage, desKey);
      logger.debug(`Login 3DES key is: ${loginKey.body.toString('hex')}`);

      socket.once('data', (data) => {
        logger.debug(
          `Received login response: ${data.toString('hex')} Decrypting...`,
        );

        const loginResponse = decrypt(data, loginKey);
        logger.debug(`Login response: ${loginResponse.toString('hex')}`);
        if (checkLoginResponse(loginResponse)) {
          logger.info('Login successfull!');
          client = getClient(socket, logger, password, desKey);
          resolve(client);
        } else {
          logger.info('Login unsuccessfull! Wrong username or password');
          reject('Wrong username or password');
        }
      });

      const message = getMessage(username, password);
      logger.debug(
        `Loggin message is: ${message.body.toString('ascii')}. Encrypting...`,
      );
      const encryptedMessage = encrypt(message.body, loginKey);
      logger.debug(`Encrypted message: ${encryptedMessage.toString('hex')}`);

      socket.write(encryptedMessage);
    });

const checkLoginResponse = (response: Buffer): boolean => {
  if (response.toString('hex', 0, 1) === 'e1') {
    return true;
  }
};
