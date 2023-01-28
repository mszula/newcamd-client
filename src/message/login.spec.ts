import { getMessage } from './login';

describe('Login message', () => {
  it('should retrun propperly prepared login message', () => {
    expect(getMessage('test', 'test')).toEqual({
      type: 'login',
      body: Buffer.from(
        'e00000746573740024312461626364656667682469725762626c6e706d772e357a377767426e7072683000',
        'hex',
      ),
    });
  });
});
