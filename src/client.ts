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
  logger.debug(`Login 3DES session key is ${sessionKey.body.toString('hex')}`);

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
        logger.debug(
          `Received card data response: ${data.toString('hex')} Decrypting...`,
        );
        const cardData = decrypt(data, sessionKey);
        logger.debug(`Card data: ${cardData.toString('hex')}`);
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

      const message = getMessage();
      logger.debug(
        `Card request is: ${message.body.toString('ascii')}. Encrypting...`,
      );
      const encryptedMessage = encrypt(message.body, sessionKey);
      logger.debug(`Encrypted message: ${encryptedMessage.toString('hex')}`);

      socket.write(encryptedMessage);
    });
