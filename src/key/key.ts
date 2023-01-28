import { pipe } from '../helpers/pipe';
import { hashPassword } from '../message/login';
import {
  InitialMessage,
  NewcamdConnectConfig,
  NewcamdLoginConfig,
} from '../types';
import { LoginKey, SessionKey } from './types';

export const createLoginKey = (
  initialMessage: InitialMessage,
  stringDesKey: NewcamdConnectConfig['desKey'],
): LoginKey => ({
  type: 'login-key',
  body: pipe(
    xorKeys(initialMessage.body, Buffer.from(stringDesKey, 'hex')),
    spread,
  ),
});

export const createSessionKey = (
  password: NewcamdLoginConfig['password'],
  stringDesKey: NewcamdConnectConfig['desKey'],
): SessionKey => ({
  type: 'session-key',
  body: pipe(
    xorKeys(
      Buffer.from(stringDesKey, 'hex'),
      Buffer.from(hashPassword(password)),
    ),
    spread,
  ),
});

const xorKeys = (initialMessage: Buffer, desKey: Buffer): Buffer => {
  const length = desKey.length;
  const loginKey = Buffer.alloc(length);

  for (let i = 0; i < length; ++i) {
    loginKey[i] = initialMessage[i] ^ desKey[i];
  }

  return loginKey;
};

const spread = (shortKey: Buffer): Buffer => {
  const spread = Buffer.allocUnsafe(16);

  spread[0] = shortKey[0] & 0xfe;
  spread[1] = ((shortKey[0] << 7) | (shortKey[1] >> 1)) & 0xfe;
  spread[2] = ((shortKey[1] << 6) | (shortKey[2] >> 2)) & 0xfe;
  spread[3] = ((shortKey[2] << 5) | (shortKey[3] >> 3)) & 0xfe;
  spread[4] = ((shortKey[3] << 4) | (shortKey[4] >> 4)) & 0xfe;
  spread[5] = ((shortKey[4] << 3) | (shortKey[5] >> 5)) & 0xfe;
  spread[6] = ((shortKey[5] << 2) | (shortKey[6] >> 6)) & 0xfe;
  spread[7] = shortKey[6] << 1;
  spread[8] = shortKey[7] & 0xfe;
  spread[9] = ((shortKey[7] << 7) | (shortKey[8] >> 1)) & 0xfe;
  spread[10] = ((shortKey[8] << 6) | (shortKey[9] >> 2)) & 0xfe;
  spread[11] = ((shortKey[9] << 5) | (shortKey[10] >> 3)) & 0xfe;
  spread[12] = ((shortKey[10] << 4) | (shortKey[11] >> 4)) & 0xfe;
  spread[13] = ((shortKey[11] << 3) | (shortKey[12] >> 5)) & 0xfe;
  spread[14] = ((shortKey[12] << 2) | (shortKey[13] >> 6)) & 0xfe;
  spread[15] = shortKey[13] << 1;

  return spread;
};
