export type Connection = {
  login: (NewcamdloginConfig: NewcamdLoginConfig) => Promise<LoginResponse>;
  close: () => void;
};

export enum LoginStatus {
  OK,
  WRONG_LOGIN_OR_PASSWORD,
}

export type LoginResponse = {
  status: LoginStatus;
  reason?: string;
  messageId: '\xe1' | '\xe2';
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

export type Logger = Pick<Console, 'warn' | 'info' | 'error' | 'log'>;
