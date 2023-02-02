# Newcamd client in TypeScript

Implementation of client Newcamd protocol.

## Installation

```sh
npm install newcamd-client
```

## How to

There are implemented a few methods which they are able to perform within Newcamd server.

```ts
import { connect } from 'newcamd-client';

const connection = await connect({
  host: '127.0.0.1',
  port: 1234,
});
const client = await connection.login({
  username: 'test',
  password: 'test',
  desKey: '0102030405060708091011121314',
});
const card = await client.getCard(); // { caid: '4326', providers: [ '001234', '009876' ] }

connection.close();
```

The code snipped above is able to connect to a server, log in and get card info (caid and providers list).

## Logger

The `connect` method allows passing a logger witch able to follow the communication with the server. The logger can [Pino](https://github.com/pinojs/pino), `console` or any object with `error`, `warn`, `info`, `debug`, `trace` functions.

```ts
const connection = await connect({
  host: '127.0.0.1',
  port: 1234,
  logger: console,
});
```

The output for the whole process like above should look like this:

> Connecting to Newcamd server 127.0.0.1:1234
> Successfully connected to server. Waiting for initial message...
> Received initial message: 96f69122046bddbfd25a50ad7651
> Trying to log in using test and given password...
> Login 3DES key is: 96fa2444600ab6b4b6ecd2481afa948a
> Loggin message is: `test$1$abcdefgh$irWbblnpmw.5z7wgBnprh0. Encrypting...
> Encrypted message: 0040cba3d1070410955310522d2cabda3eda4397c3d06b75744908887c68b2e99b7a0c0214f2eaa72a4eaf9c8016d2c179a543b8717ee54da8edd97ac983f518d982
> Received login response: 00189028c2e4c769051d47253f0a16197aab2c4cefb0139cd4c2 Decrypting...
> Login response: e10000453296
> Login successfull!
> Login 3DES session key is 301eccaeb608941c1a20504030083402
> Card request is: c. Encrypting...
> Encrypted message: 00184a51c3f8b0c73cd3804c881c654e64f76822a4a7204f5617
> Received card data response: 00380fb934729bf11bc64462b5d9d6e10b21d33d56f2e081f667a37e7157cfed0d13da9f207a13a0e3b05cb9d0b4e41c88798409e37c22662d5f Decrypting...
> Card data: e400220b43260000000000000000020012340000000000000000009876000000000000000062
> Closing connection... Bye!

## Why

Actually, because I can 😄 The Newcamd protocol is a real piece of obsolete, and ancient way to exchange messages. It uses a fully binary data format encrypted with 3DES. No JSON, no XML, no Protobuf, just simple, blazing-fast bitwise beauty.
I was curious if TypeScript will able me to implement useful client, and it could!

I'm not planning to implement the more message types, like exchanging ECM, DW, etc.
