import { GetCardMessage } from './types';

const ID = '\xe3';

export const getMessage = (): GetCardMessage => {
  return {
    type: 'get-card',
    body: Buffer.from(`${ID}\0\0`, 'latin1'),
  };
};
