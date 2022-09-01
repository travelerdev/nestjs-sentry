<p align="center">
  <h3 align="center">
    @travelerdev/nestjs-sentry-graphql
  </h3>

  <p align="center">
    Provides an injectable sentry.io client to provide enterprise logging of nestjs modules using GraphQL
  </p>
</p>

## About

`@travelerdev/nestjs-sentry-graphql` is an extension of `@travelerdev/nestjs-sentry`, which is
itself built upon the foundation developed by
[`@ntegral/nestjs-sentry`](https://github.com/ntegral/nestjs-sentry).

This package implements a module, `SentryModule` which when imported into your nestjs project
provides a Sentry.io client to any class that injects it. This lets Sentry.io be worked into your
dependency injection workflow without having to do any extra work outside of the initial setup.

It also implements a class, `GraphqlInterceptor`, which can intercept resolver errors into Sentry.

If you do not use graphql, you should consider using `@travelerdev/nestjs-sentry` instead to avoid
unnecessary dependencies.

## Getting Started

For details getting started instructions, see `@travelerdev/nestjs-sentry`

### Quick Start

```bash
npm install --save @travelerdev/nestjs-sentry-graphql @nestjs/graphql
```

To get started with `@travelerdev/nestjs-sentry-graphql` you should add an import of
`SentryModule.forRoot` to your app's root module.

```typescript
import { Module } from '@nestjs-common';
import { SentryModule } from '@travelerdev/nestjs-sentry-graphql';

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

There are other instantiation methods documented in `@travelerdev/nestjs-sentry`'s readme.

### GraphQL Interceptor

The GraphqlInterceptor in this package can be used at the App level to intercept resolver errors and
pass them up to Sentry.

Using graphql interceptor globally:

```typescript
import { Module } from '@nestjs/common';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { GraphqlInterceptor } from '@travelerdev/nestjs-sentry-graphql';

@Module({
  ....
  providers: [
    {
      provide: APP_INTERCEPTOR,
      useFactory: () => new GraphqlInterceptor(),
    },
  ],
})
export class AppModule {}
```
