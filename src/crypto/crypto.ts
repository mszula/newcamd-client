import { randomBytes } from 'crypto';
import { pipe } from '../helpers/pipe';
import { Key } from '../key/types';
import { DES_BLOCK_SIZE } from './const';
import {
  addChecksum,
  addNetBuff,
  addRandomPad,
  prependWithLength,
  tripleDes,
} from './crypt-helpers';
import {
  checkLength,
  decryptTripleDes,
  checkChecksum,
  skipNetData,
} from './decrypt-helpers';

const prepareKey = (key: Buffer): Buffer => {
  if (key.length == 16) {
    return Buffer.concat([key, key.subarray(0, 8)], 24);
  }

  return key;
};

export const encrypt = (message: Buffer, key: Key): Buffer => {
  return pipe(
    message,
    addNetBuff,
    addRandomPad,
    addChecksum,
    tripleDes(prepareKey(key.body), randomBytes(DES_BLOCK_SIZE)),
    prependWithLength,
  );
};

export const decrypt = (message: Buffer, key: Key): Buffer => {
  return pipe(
    message,
    checkLength,
    decryptTripleDes(prepareKey(key.body)),
    checkChecksum,
    skipNetData,
  );
};
