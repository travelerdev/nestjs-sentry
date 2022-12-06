# Changelog

## 4.1.1

- Minor dependency updates
- Bugfix - remove relative path import in package.json

## 4.1.0

Stricter typing on Severity helper object

- Specifically type the keys on the Severity psuedo-enum so Typescript can enforce valid access. This is a **breaking change** because invalid accesses that were previously allowed will no longer compile.

## 4.0.1

Day zero patch

- Restore valid uses of `any` type

## 4.0.0

The initial port from @ntegral/nestjs-sentry.

Changes:

- Break project into a nestjs-sentry and a nestjs-sentry-graphql package.
- Update dependencies to Nest 9.x and latest Sentry.
- Move to lerna for workspace management.
