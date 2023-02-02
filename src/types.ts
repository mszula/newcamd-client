export type Connection = {
  login: (NewcamdloginConfig: NewcamdLoginConfig) => Promise<Client>;
  close: () => void;
};

export type Client = {
  getCard: () => Promise<Card>;
};

export type Card = {
  caid: string;
  providers: string[];
};

export type NewcamdConnectConfig = {
  host: string;
  port: number;
  logger?: Logger;
};

export type NewcamdLoginConfig = {
  username: string;
  password: string;
  desKey: string;
};

export type InitialMessage = {
  type: 'initial';
  body: Buffer;
};

export type Logger = Pick<
  Console,
  'warn' | 'info' | 'error' | 'trace' | 'debug'
>;
