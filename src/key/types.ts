export type LoginKey = {
  type: 'login-key';
  body: Buffer;
};

export type SessionKey = {
  type: 'session-key';
  body: Buffer;
};
