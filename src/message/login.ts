import { LoginMessage } from './types';
import { crypt } from 'crypt3-md5';

const ID = '\xe0';
const PASSWORD_SALT = '$1$abcdefgh$';

export const getMessage = (login: string, password: string): LoginMessage => {
  return {
    type: 'login',
    body: Buffer.from(
      `${ID}\0\0${login}\0${hashPassword(password)}\0`,
      'latin1',
    ),
  };
};

export const hashPassword = (password: string): string =>
  crypt(password, PASSWORD_SALT);
