import { createLoginKey } from './key';

describe('Login key', () => {
  it('should retrun propperly prepared login key', () => {
    expect(
      createLoginKey(
        {
          type: 'initial',
          body: Buffer.from('975e959aae6855579f629d708d0e', 'hex'),
        },
        '0102030405060708091011121314',
      ),
    ).toEqual({
      type: 'login-key',
      body: Buffer.from('962e24d2ea5ab8a45eca9c50c6147834', 'hex'),
    });

    expect(
      createLoginKey(
        {
          type: 'initial',
          body: Buffer.from('0000000000000000000000000000', 'hex'),
        },
        '0102030405060708091011121314',
      ),
    ).toEqual({
      type: 'login-key',
      body: Buffer.from('008080604028180e0804440210904c28', 'hex'),
    });
  });
});
