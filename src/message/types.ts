export type LoginMessage = {
  type: 'login';
  body: Buffer;
};

export type GetCardMessage = {
  type: 'get-card';
  body: Buffer;
};
