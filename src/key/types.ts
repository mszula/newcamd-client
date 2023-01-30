export type Key = {
  type: 'login-key' | 'session-key';
  body: Buffer;
};

export type LoginKey = Key & {
  type: 'login-key';
};

export type SessionKey = Key & {
  type: 'session-key';
};
