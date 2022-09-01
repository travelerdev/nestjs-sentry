import { SeverityLevel } from '@sentry/node';

/**
 * As of version 7.x, Sentry moved away from a defined Severity enum in favor of
 * string constants unioned into the type SeverityLevel. For backwards compatibility,
 * and to avoid dealing with string constants everywhere, this emulates the enum but
 * in a way that is compatible with Sentry 7 without requiring a cast.
 */
export const Severity: Record<string, SeverityLevel> = {
  Fatal: 'fatal',
  Error: 'error',
  Warning: 'warning',
  Log: 'log',
  Info: 'info',
  Debug: 'debug'
};
