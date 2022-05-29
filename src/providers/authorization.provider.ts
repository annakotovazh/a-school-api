import {AuthorizationContext, AuthorizationDecision, AuthorizationMetadata, Authorizer} from '@loopback/authorization';
import {Provider} from '@loopback/core';

export class MyAuthorizationProvider implements Provider<Authorizer> {
  constructor() {}

  /**
   * @returns authenticateFn
   */
  value(): Authorizer {
    return this.authorize.bind(this);
  }

  async authorize(
    authorizationCtx: AuthorizationContext,
    metadata: AuthorizationMetadata,
  ) {
    const clientRole = authorizationCtx.principals[0].name;
    const allowedRoles = metadata.allowedRoles ?? [];
    let res = AuthorizationDecision.ALLOW;
    if (!allowedRoles.includes(clientRole)) {
      res = AuthorizationDecision.DENY;
    }
    else {
      if (metadata.scopes && metadata.scopes[0] === 'id') {
        if (authorizationCtx.principals[0].id != authorizationCtx.invocationContext.args[0]) {
          res = AuthorizationDecision.DENY;
        }
      }
    }

    return res;
  }
}
