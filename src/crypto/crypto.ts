import { randomBytes } from 'crypto';
import { pipe } from '../helpers/pipe';
import { DES_BLOCK_SIZE } from './const';
import {
  addChecksum,
  addNetBuff,
  addRandomPad,
  prependWithLength,
  tripleDes,
} from './helper';

const prepareKey = (key: Buffer): Buffer => {
  if (key.length == 16) {
    return Buffer.concat([key, key.subarray(0, 8)], 24);
  }

  return key;
};

export const encrypt = (message: Buffer, key: Buffer): Buffer => {
  return pipe(
    message,
    addNetBuff,
    addRandomPad,
    addChecksum,
    tripleDes(prepareKey(key), randomBytes(DES_BLOCK_SIZE)),
    prependWithLength,
  );
};
