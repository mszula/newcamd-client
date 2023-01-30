import { decrypt, encrypt } from './crypto';
import { addChecksum, addNetBuff, addRandomPad } from './crypt-helpers';
import { pipe } from '../helpers/pipe';

const loginMessage = Buffer.from(
  'e00000746573740024312461626364656667682469725762626c6e706d772e357a377767426e7072683000',
  'hex',
);

describe('Crypto', () => {
  beforeAll(() => {
    jest
      // eslint-disable-next-line @typescript-eslint/no-var-requires
      .spyOn(require('crypto'), 'randomBytes')
      .mockImplementation((len: number) => Buffer.from('a'.repeat(len)));
  });

  it('should crypt data', () => {
    expect(
      encrypt(loginMessage, {
        type: 'login-key',
        body: Buffer.from('962e24d2ea5ab8a45eca9c50c6147834', 'hex'),
      }),
    ).toEqual(
      Buffer.from(
        '00405baee2f1fe9f32f566d868de2c82c9460a4ed9041f516a75ffefbb50d233d4091dbd28311f0fc380fca0530f42926c79f950f8ad6066977d6161616161616161',
        'hex',
      ),
    );
    expect(
      encrypt(loginMessage, {
        type: 'login-key',
        body: Buffer.from('482c3014bc8ac45eaec28cacf2dcc008', 'hex'),
      }),
    ).toEqual(
      Buffer.from(
        '0040ea33bfb0945e5ba8418b54f1a05cc0f3ce53002731e43cb9850ccbc71c36009418e0df611079dd027ea9ae67607d8b3515944c6cb2b5003b6161616161616161',
        'hex',
      ),
    );
  });

  it('should add net buff', () => {
    expect(pipe(loginMessage, addNetBuff)).toEqual(
      Buffer.from(
        '00000000000000000000e00028746573740024312461626364656667682469725762626c6e706d772e357a377767426e7072683000',
        'hex',
      ),
    );
  });

  it('should add random pad', () => {
    expect(pipe(loginMessage, addNetBuff, addRandomPad)).toEqual(
      Buffer.from(
        '00000000000000000000e00028746573740024312461626364656667682469725762626c6e706d772e357a377767426e70726830006161',
        'hex',
      ),
    );
  });

  it('should add checksum', () => {
    expect(pipe(loginMessage, addNetBuff, addRandomPad, addChecksum)).toEqual(
      Buffer.from(
        '00000000000000000000e00028746573740024312461626364656667682469725762626c6e706d772e357a377767426e70726830006161d7',
        'hex',
      ),
    );
  });

  it('should decrypt data', () => {
    expect(
      decrypt(
        Buffer.from(
          '0018ddba351167304572a45f978708d99edba45ab287b1571427',
          'hex',
        ),
        {
          type: 'login-key',
          body: Buffer.from('da368c7cba28b4fed4ecdca83abec890', 'hex'),
        },
      ),
    ).toEqual(Buffer.from('e100007a811a', 'hex'));
  });
});
