import { randomBytes, createCipheriv } from 'crypto';
import { DES_BLOCK_SIZE } from './const';

export const addNetBuff = (message: Buffer): Buffer => {
  const len = message.length;
  message[1] = (message[1] & 0xf0) | (((len - 3) >> 8) & 0x0f);
  message[2] = (len - 3) & 0xff;

  return Buffer.concat([Buffer.alloc(10), message]);
};

export const addRandomPad = (message: Buffer): Buffer => {
  const noPadBytes =
    (DES_BLOCK_SIZE - ((message.length + 1) % DES_BLOCK_SIZE)) % DES_BLOCK_SIZE;
  return Buffer.concat([message, randomBytes(noPadBytes)]);
};

export const addChecksum = (message: Buffer): Buffer => {
  const checksum = Buffer.alloc(1);
  for (let i = 0; i < message.length; i++) {
    checksum[0] ^= message[i];
  }
  return Buffer.concat([message, checksum]);
};

export const tripleDes =
  (key: Buffer, firstIv: Buffer) =>
  (message: Buffer): Buffer => {
    let cryptedMessage: Buffer = Buffer.alloc(0);
    let iv: Buffer = firstIv;

    for (let i = 0; i < message.length; i += DES_BLOCK_SIZE) {
      iv = createCipheriv('des-ede3-cbc', key, iv).update(
        message.subarray(i, i + DES_BLOCK_SIZE),
      );
      cryptedMessage = Buffer.concat([cryptedMessage, iv]);
    }
    return Buffer.concat([cryptedMessage, firstIv]);
  };

export const prependWithLength = (message: Buffer): Buffer => {
  const len = Buffer.alloc(2);
  len.writeInt16BE(message.length);

  return Buffer.concat([len, message]);
};
