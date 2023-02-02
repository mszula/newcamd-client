# Newcamd client in TypeScript

Implementation of client Newcamd protocol.

## Installation

```sh
npm install newcamd-client
```

## How to

There are implemented of a few methods which they are able to perform within Newcamd server.

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
const card = await client.getCard();

connection.close();
```

The code snipped above able to connect to server, log in and get card info (caid and providers list).

## Logger

The `connect` method allow to pass a logger with able to follow the communication with server. The logger can be any object with `error`, `warn`, `info`, `debug`, `trace` functionsm like [Pino](https://github.com/pinojs/pino) or just `console`.

```ts
import { connect } from 'newcamd-client';

const connection = await connect({
  host: '127.0.0.1',
  port: 1234,
  logger: console,
});
```

The output should looks like below

> Connecting to Newcamd server 127.0.0.1:1234
> Successfully connected to server. Waiting for initial message...
> Received initial message: 27b5770bcb9b75671b957b26e216
> Trying to log in using test and given password...
> Login 3DES key is: 265adc80fc7474e46e88a0aca2a6c404
> Loggin message is: `test$1$abcdefgh$irWbblnpmw.5z7wgBnprh0. Encrypting...
> Encrypted message: 00403a0a05ab282b587431f13b48756357ee72d6f25a04b94d1b82b41a15d231e5ed84e5753fa4b431d559c3fea437613173f71b963b3cf01b3fb1de2c39d00207a7
> Received login response: 00189cf562b85de9d3f3028d119067de2cbf2ab5fdf6a679f4e7 Decrypting...
> Login response: e10000596dd5
> Login successfull!

## Why

Actually, because I can 😄 The Newcamd protocol is a real piece of obsolete, and ancient way to exchange messages. It uses a fully binary data format encrypted with 3DES. No JSON, no XML, no Protobuf, just simple, blazing-fast bitwise beauty.
I was curious if TypeScript will able me to implement useful client, and it could!

I'm not planning to implement the more message types, like exchanging ECM, DW, etc.
