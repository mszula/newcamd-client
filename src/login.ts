import { Socket } from 'net';
import { decrypt, encrypt } from './crypto/crypto';
import { createLoginKey } from './key/key';
import { getMessage } from './message/login';
import {
  InitialMessage,
  LoginResponse,
  LoginStatus,
  NewcamdConnectConfig,
  NewcamdLoginConfig,
} from './types';

export const login =
  (
    socket: Socket,
    initialMessage: InitialMessage,
    desKey: NewcamdConnectConfig['desKey'],
  ) =>
  ({ username, password }: NewcamdLoginConfig): Promise<LoginResponse> => {
    return new Promise((resolve) => {
      const loginKey = createLoginKey(initialMessage, desKey);
      socket.once('data', (data) =>
        resolve(checkLoginResponse(decrypt(data, loginKey))),
      );

      socket.write(encrypt(getMessage(username, password).body, loginKey));
    });
  };

const checkLoginResponse = (response: Buffer): LoginResponse => {
  switch (response.toString('hex', 0, 1)) {
    case 'e1':
      return { status: LoginStatus.OK, messageId: '\xe1' };
    case 'e2':
      return {
        status: LoginStatus.WRONG_LOGIN_OR_PASSWORD,
        reason: 'Wrong pass',
        messageId: '\xe2',
      };
    default:
      break;
  }
};
