import { Socket } from 'net';
import { decrypt, encrypt } from './crypto/crypto';
import { createSessionKey } from './key/key';
import { SessionKey } from './key/types';
import { getMessage } from './message/get-card';
import {
  Card,
  Client,
  NewcamdConnectConfig,
  NewcamdLoginConfig,
} from './types';

export const getClient = (
  socket: Socket,
  password: NewcamdLoginConfig['password'],
  desKey: NewcamdConnectConfig['desKey'],
): Client => {
  const sessionKey = createSessionKey(password, desKey);
  return {
    getCard: getCard(socket, sessionKey),
  };
};

export const getCard =
  (socket: Socket, sessionKey: SessionKey) => (): Promise<Card> =>
    new Promise((resolve) => {
      socket.once('data', (data) => {
        const cardData = decrypt(data, sessionKey);
        const providers: string[] = [];
        for (let i = 0; i < cardData[14]; i++) {
          providers.push(
            cardData.subarray(15 + 11 * i, 15 + 11 * i + 3).toString('hex'),
          );
        }

        resolve({
          caid: cardData.subarray(4, 6).toString('hex'),
          providers,
        });
      });

      socket.write(encrypt(getMessage().body, sessionKey));
    });
