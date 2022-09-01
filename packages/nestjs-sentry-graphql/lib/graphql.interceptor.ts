import { ExecutionContext, Injectable } from '@nestjs/common';
import { GqlContextType, GqlExecutionContext } from '@nestjs/graphql';

// Sentry imports
import { Scope } from '@sentry/hub';
import { Handlers } from '@sentry/node';

import { SentryInterceptor } from '@travelerdev/nestjs-sentry';

@Injectable()
export class GraphqlInterceptor extends SentryInterceptor {
  protected captureException(context: ExecutionContext, scope: Scope, exception: unknown) {
    if (context.getType<GqlContextType>() === 'graphql') {
      this.captureGraphqlException(scope, GqlExecutionContext.create(context), exception);
    } else {
      super.captureException(context, scope, exception);
    }
  }

  private captureGraphqlException(
    scope: Scope,
    gqlContext: GqlExecutionContext,
    exception: unknown,
  ): void {
    const info = gqlContext.getInfo();
    const context = gqlContext.getContext();

    scope.setExtra('type', info.parentType.name);

    if (context.req) {
      // req within graphql context needs modification in
      const data = Handlers.parseRequest({}, context.req, {});

      scope.setExtra('req', data.request);

      if (data.extra) scope.setExtras(data.extra);
      if (data.user) scope.setUser(data.user);
    }

    this.client.instance().captureException(exception);
  }
}
