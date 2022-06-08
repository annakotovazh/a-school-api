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
    // client role from JWT access token
    const clientRole = authorizationCtx.principals[0].name;
// list of roles allowed toaccess the resource(class or method)
    const allowedRoles = metadata.allowedRoles ?? [];
    let res = AuthorizationDecision.ALLOW;
    //check if the array contains this role
    if (!allowedRoles.includes(clientRole)) {
      //if not,access deny
      res = AuthorizationDecision.DENY;
    }
    else {
      //id verification to match user id from token first query param( user profile id)
      // you can get or update only own user profile
      if (metadata.scopes && metadata.scopes[0] === 'id') {
        if (authorizationCtx.principals[0].id != authorizationCtx.invocationContext.args[0]) {
          res = AuthorizationDecision.DENY;
        }
      }
    }

    return res;
  }
}
