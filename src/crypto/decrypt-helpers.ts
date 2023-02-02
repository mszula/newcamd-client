import { createDecipheriv } from 'crypto';
import { DES_BLOCK_SIZE, CIPHER_ALGORITHM } from './const';

export const checkLength = (message: Buffer): Buffer => {
  if (message.subarray(0, 2).readUInt16BE(0) !== message.length - 2) {
    new Error('Incorrect received message length. Check your connection');
  }
  return message.subarray(2, message.length);
};

export const decryptTripleDes =
  (key: Buffer) =>
  (message: Buffer): Buffer => {
    let iv = message.subarray(message.length - 8, message.length);
    let decrypted: Buffer = Buffer.alloc(0);

    for (let i = 0; i < message.length - 8; i += DES_BLOCK_SIZE) {
      const cipher = createDecipheriv(CIPHER_ALGORITHM, key, iv).setAutoPadding(
        false,
      );
      const currentMessagePart = message.subarray(i, i + DES_BLOCK_SIZE);

      decrypted = Buffer.concat([decrypted, cipher.update(currentMessagePart)]);
      iv = currentMessagePart;
    }

    return decrypted;
  };

export const checkChecksum = (message: Buffer): Buffer => {
  let checksum: number = 0;
  for (let i = 0; i < message.length; i++) {
    checksum ^= message[i];
  }

  if (checksum !== 0) {
    new Error('Incorrect response message checksum! Check your connection.');
  }

  return message;
};

export const skipNetData = (message: Buffer): Buffer =>
  message.subarray(10, message.length);
