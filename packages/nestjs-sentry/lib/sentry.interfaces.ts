import {
  InjectionToken,
  ModuleMetadata,
  OptionalFactoryDependency,
  Type
} from '@nestjs/common/interfaces';
import { Integration, Options } from '@sentry/types';
import { ConsoleLoggerOptions } from '@nestjs/common';
import { SeverityLevel } from '@sentry/node';

export interface SentryCloseOptions {
  enabled: boolean;
  // timeout – Maximum time in ms the client should wait until closing forcefully
  timeout?: number;
}

export type SentryModuleOptions = Omit<Options, 'integrations'> & {
  integrations?: Integration[];
  close?: SentryCloseOptions;
} & ConsoleLoggerOptions;

export interface SentryOptionsFactory {
  createSentryModuleOptions(): Promise<SentryModuleOptions> | SentryModuleOptions;
}

export interface SentryModuleAsyncOptions extends Pick<ModuleMetadata, 'imports'> {
  inject?: (InjectionToken | OptionalFactoryDependency)[];
  useClass?: Type<SentryOptionsFactory>;
  useExisting?: Type<SentryOptionsFactory>;
  useFactory?: (...args: unknown[]) => Promise<SentryModuleOptions> | SentryModuleOptions;
}

export type SentryTransaction = boolean | 'path' | 'methodPath' | 'handler';

export interface SentryFilterFunction {
  (exception: unknown): boolean;
}

export interface SentryInterceptorOptionsFilter {
  // This one type must remain an `any` because it's used as the RHS of an `instanceof` operator
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  type: any;
  filter?: SentryFilterFunction;
}

export interface SentryInterceptorOptions {
  filters?: SentryInterceptorOptionsFilter[];
  tags?: { [key: string]: string };
  extra?: { [key: string]: unknown };
  fingerprint?: string[];
  level?: SeverityLevel;

  // https://github.com/getsentry/sentry-javascript/blob/master/packages/node/src/handlers.ts#L163
  request?: boolean;
  serverName?: boolean;
  transaction?: boolean | 'path' | 'methodPath' | 'handler'; // https://github.com/getsentry/sentry-javascript/blob/master/packages/node/src/handlers.ts#L16
  user?: boolean | string[];
  version?: boolean;
}
