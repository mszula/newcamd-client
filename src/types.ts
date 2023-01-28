export type Client = {
  login: (NewcamdloginConfig: NewcamdLoginConfig) => Promise<boolean>;
  close: () => void;
};

export type NewcamdConnectConfig = {
  host: string;
  port: number;
  desKey: string;
};

export type NewcamdLoginConfig = {
  username: string;
  password: string;
};

export type InitialMessage = {
  type: 'initial';
  body: Buffer;
};

export type LoginKey = {
  type: 'login-key';
  body: Buffer;
};

export type SessionKey = {
  type: 'session-key';
  body: Buffer;
};

export type Logger = Pick<Console, 'warn' | 'info' | 'error' | 'log'>;
