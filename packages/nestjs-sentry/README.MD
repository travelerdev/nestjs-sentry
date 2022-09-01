[![npm version](http://img.shields.io/npm/v/@travelerdev/nestjs-sentry.svg?style=flat)](https://npmjs.org/package/@travelerdev/nestjs-sentry 'View this project on npm')
[![ISC license](http://img.shields.io/badge/license-ISC-brightgreen.svg)](http://opensource.org/licenses/ISC)

<p align="center">
  <h3 align="center">
    @travelerdev/nestjs-sentry
  </h3>

  <p align="center">
    Provides an injectable sentry.io client to provide both automated and manual enterprise logging of nestjs modules
  </p>
</p>

## Table Of Contents

- [About](#about)
- [GraphQL Support](#graphql-support)
- [NestJS 9 Support](#nestjs-9-support)
- [Installation](#installation)
- [Getting Started](#getting-started)
- [Contributing](#contributing)
- [License](#license)
- [Acknowledgements](#acknowledgements)

## About

`@travelerdev/nestjs-sentry` is built upon the foundation developed by [`@ntegral/nestjs-sentry`](https://github.com/ntegral/nestjs-sentry).
Both packages implement a module, `SentryModule` which when imported into
your nestjs project provides a Sentry.io client to any class that injects it. This
lets Sentry.io be worked into your dependency injection workflow without having to
do any extra work outside of the initial setup.

It can optionally also intercept error messages logged by your system and automatically propogate those to Sentry.

### GraphQL Support

If you are writing a server that uses `@nestjs/graphql`, you probably want to use the package `@travelerdev/nestjs-sentry-graphql` instead.
It contains all the same code as this package but adds an interceptor specifically for GraphQL resolvers. It has been separated out into its own package
so that depending on this package does not introduce any dependencies on `@nestjs/graphql`.

## NestJS 9 Support

This package begins at version 4.x.x and supports NestJS 9+. If you need support for NestJS 8 or 7, please visit [`@ntegral/nestjs-sentry`](https://github.com/ntegral/nestjs-sentry) for support.

## Installation

```bash
npm install --save @travelerdev/nestjs-sentry @sentry/node
```

## Getting Started

To get started with `@travelerdev/nestjs-sentry` you should add an import of `SentryModule.forRoot` to your app's root module.

```typescript
import { Module } from '@nestjs-common';
import { SentryModule } from '@travelerdev/nestjs-sentry';

@Module({
  imports: [
    SentryModule.forRoot({
      dsn: '<< your sentry_io_dsn >>',
      debug: true | false,
      environment: 'dev' | 'production' | 'some_environment',
      release: 'some_release', | null, // must first create a release in sentry.io dashboard
      logLevels: ["debug"] //based on sentry.io loglevel //
    }),
  ],
})
export class AppModule {}
```

You can alternatively use an async config factory if you need injected dependencies:

```typescript
import { Module } from '@nestjs-common';
import { SentryModule } from '@travelerdev/nestjs-sentry';
import { ConfigModule } from '@nestjs/config';
import { ConfigService } from '@nestjs/config';

@Module({
  imports: [
    SentryModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (cfg:ConfigService) => ({
        dsn: cfg.get('SENTRY_DSN'),
        debug: true | false,
        environment: 'dev' | 'production' | 'some_environment',
        release: 'some_release', | null, // must create a release in sentry.io dashboard
        logLevels: ["debug"] //based on sentry.io loglevel //
      }),
      inject: [ConfigService],
    })
  ]
})

export class AppModule {}
```

After importing, you can then inject the Sentry client into any of your injectables with the provided decorator:

```typescript
import { Injectable } from '@nestjs/common';
import { InjectSentry, SentryService } from '@travelerdev/nestjs-sentry';

@Injectable()
export class AppService {
  public constructor(@InjectSentry() private readonly client: SentryService) {
      client.instance().captureMessage(message, Sentry.Severity.Log);
      client.instance().captureException(exception);
      ... and more
  }
}
```

To automatically absorb messages from your service into Sentry, you can instruct Nest to use the SentryService as the default logger:

```typescript
async function bootstrap() {
  const app = await NestFactory.create(AppModule, { logger: false });

  app.useLogger(SentryService.SentryServiceInstance());
  await app.listen(3000);
}
bootstrap();
```

You can use the various logging and breadcrumbing methods to create helpful debug information in Sentry:

```typescript
import { Injectable } from '@nestjs/common';
import { InjectSentry, SentryService } from '@travelerdev/nestjs-sentry';
import { Severity } from '@sentry/types';

@Injectable()
export class AppService {
  constructor(@InjectSentry() private readonly client: SentryService) {
    client.log('AppSevice Loaded', 'test', true); // creates log asBreadcrumb //
    client.instance().addBreadcrumb({
      level: Severity.Debug,
      message: 'How to use native breadcrumb',
      data: { context: 'WhatEver' }
    });
    client.debug('AppService Debug', 'context');
  }
}
```

## Flushing sentry

Sentry does not flush all the errors by itself, it does it in background so that it doesn't block the main thread. If
you kill the nestjs app forcefully some exceptions don't have to be flushed and logged successfully.

If you want to force that behaviour use the close flag in your options. That is handy if using nestjs as a console
runner. Keep in mind that you need to have `app.enableShutdownHooks();` enabled in order
for closing (flushing) to work.

```typescript
import { Module } from '@nestjs-common';
import { SentryModule } from '@travelerdev/nestjs-sentry';
import { LogLevel } from '@sentry/types';

@Module({
  imports: [
    SentryModule.forRoot({
      dsn: 'sentry_io_dsn',
      debug: true | false,
      environment: 'dev' | 'production' | 'some_environment',
      release: 'some_release', | null, // must create a release in sentry.io dashboard
      logLevel: LogLevel.Debug //based on sentry.io loglevel //
      close: {
        enabled: true,
        // Time in milliseconds to forcefully quit the application
        timeout?: number,
      }
    }),
  ],
})
export class AppModule {}
```

## Contributing

This project is itself a fork of a long-lived open source projects, and so contributions are always welcome.
They are the only way to keep this project alive and thriving. If you want to contribute, please follow these steps:

1. Fork the repository
2. Create your branch (`git checkout -b my-feature-name`)
3. Commit any changes to your branch
4. Push your changes to your remote branch
5. Open a pull request

## License

Distributed under the ISC License. See `LICENSE` for more information.

## Acknowledgements

- [nestjs](https://nestjs.com)
- [@sentry/node](https://github.com/getsentry/sentry-javascript)

Copyright &copy; 2019 Ntegral Inc. and 2022 Traveler Dev Ltd. (England 13120175)
