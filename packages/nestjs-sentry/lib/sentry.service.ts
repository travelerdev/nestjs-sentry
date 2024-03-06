import { Inject, Injectable, ConsoleLogger, LogLevel } from '@nestjs/common';
import { OnApplicationShutdown } from '@nestjs/common';
import { ClientOptions, Client } from '@sentry/types';
import * as Sentry from '@sentry/node';
import { SENTRY_MODULE_OPTIONS } from './sentry.constants';
import { SentryModuleOptions } from './sentry.interfaces';
import { Severity } from './severity.enum';

@Injectable()
export class SentryService extends ConsoleLogger implements OnApplicationShutdown {
  app = '@ntegral/nestjs-sentry: ';
  private static serviceInstance: SentryService;
  constructor(
    @Inject(SENTRY_MODULE_OPTIONS)
    readonly opts?: SentryModuleOptions
  ) {
    super();
    if (!(opts && opts.dsn)) {
      // console.log('options not found. Did you use SentryModule.forRoot?');
      return;
    }
    if (!SentryService.serviceInstance) {
      SentryService.serviceInstance = this;
    }

    const { integrations = [], ...sentryOptions } = opts;
    Sentry.init({
      ...sentryOptions,
      integrations: [
        new Sentry.Integrations.OnUncaughtException({
          onFatalError: async (err) => {
            // console.error('uncaughtException, not cool!')
            // console.error(err);
            if (err.name === 'SentryError') {
              console.log(err);
            } else {
              Sentry.getCurrentHub().getClient<Client<ClientOptions>>()?.captureException(err);
              process.exit(1);
            }
          }
        }),
        new Sentry.Integrations.OnUnhandledRejection({ mode: 'warn' }),
        ...integrations
      ]
    });
  }

  public static SentryServiceInstance(): SentryService {
    if (!SentryService.serviceInstance) {
      SentryService.serviceInstance = new SentryService();
    }
    return SentryService.serviceInstance;
  }

  log(message: string, context?: string, asBreadcrumb?: boolean) {
    if (!this._shouldLog('log')) return;

    message = `${this.app} ${message}`;
    try {
      super.log(message, context);
      asBreadcrumb
        ? Sentry.addBreadcrumb({
            message,
            level: Severity.Log,
            data: {
              context
            }
          })
        : Sentry.captureMessage(message, Severity.Log);
    } catch (err) {}
  }

  error(message: string, trace?: string, context?: string) {
    if (!this._shouldLog('error')) return;

    message = `${this.app} ${message}`;
    try {
      super.error(message, trace, context);
      Sentry.captureMessage(message, Severity.Error);
    } catch (err) {}
  }

  warn(message: string, context?: string, asBreadcrumb?: boolean) {
    if (!this._shouldLog('warn')) return;

    message = `${this.app} ${message}`;
    try {
      super.warn(message, context);
      asBreadcrumb
        ? Sentry.addBreadcrumb({
            message,
            level: Severity.Warning,
            data: {
              context
            }
          })
        : Sentry.captureMessage(message, Severity.Warning);
    } catch (err) {}
  }

  debug(message: string, context?: string, asBreadcrumb?: boolean) {
    if (!this._shouldLog('debug')) return;

    message = `${this.app} ${message}`;
    try {
      super.debug(message, context);
      asBreadcrumb
        ? Sentry.addBreadcrumb({
            message,
            level: Severity.Debug,
            data: {
              context
            }
          })
        : Sentry.captureMessage(message, Severity.Debug);
    } catch (err) {}
  }

  verbose(message: string, context?: string, asBreadcrumb?: boolean) {
    if (!this._shouldLog('verbose')) return;

    message = `${this.app} ${message}`;
    try {
      super.verbose(message, context);
      asBreadcrumb
        ? Sentry.addBreadcrumb({
            message,
            level: Severity.Info,
            data: {
              context
            }
          })
        : Sentry.captureMessage(message, Severity.Info);
    } catch (err) {}
  }

  instance() {
    return Sentry;
  }

  async onApplicationShutdown() {
    if (this.opts?.close?.enabled === true) {
      await Sentry.close(this.opts?.close.timeout);
    }
  }

  private _shouldLog(level: LogLevel) {
    if (!this.opts?.logLevels) return true;
    return this.opts?.logLevels?.includes(level);
  }
}
