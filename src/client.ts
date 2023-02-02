import { Socket } from 'net';
import { decrypt, encrypt } from './crypto/crypto';
import { createSessionKey } from './key/key';
import { SessionKey } from './key/types';
import { getMessage } from './message/get-card';
import { Card, Client, Logger, NewcamdLoginConfig } from './types';

export const getClient = (
  socket: Socket,
  logger: Logger,
  password: NewcamdLoginConfig['password'],
  desKey: NewcamdLoginConfig['desKey'],
): Client => {
  const sessionKey = createSessionKey(password, desKey);
  return {
    getCard: getCard(socket, logger, sessionKey),
  };
};

let card: Card = null;
export const getCard =
  (socket: Socket, logger: Logger, sessionKey: SessionKey) =>
  (): Promise<Card> =>
    new Promise((resolve) => {
      if (card) {
        resolve(card);
      }
      socket.once('data', (data) => {
        const cardData = decrypt(data, sessionKey);
        const providers: string[] = [];
        for (let i = 0; i < cardData[14]; i++) {
          providers.push(
            cardData.subarray(15 + 11 * i, 15 + 11 * i + 3).toString('hex'),
          );
        }

        card = {
          caid: cardData.subarray(4, 6).toString('hex'),
          providers,
        };
        resolve(card);
      });

      socket.write(encrypt(getMessage().body, sessionKey));
    });
