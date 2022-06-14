import {
  AuthenticateFn,
  AuthenticationBindings,
  AUTHENTICATION_STRATEGY_NOT_FOUND,
  USER_PROFILE_NOT_FOUND
} from '@loopback/authentication';
import {inject} from '@loopback/core';
import {FindRoute, HttpErrors, InvokeMethod, InvokeMiddleware, ParseParams, Reject, RequestContext, Send, SequenceActions, SequenceHandler} from '@loopback/rest';
import {RateLimitAction, RateLimitSecurityBindings} from 'loopback4-ratelimiter';
import {SequenceService} from './services';

//const SequenceActions = RestBindings.SequenceActions;

export class MySequence implements SequenceHandler {
  @inject(SequenceActions.INVOKE_MIDDLEWARE, {optional: true})
  protected invokeMiddleware: InvokeMiddleware = () => false;

  constructor(
    @inject(SequenceActions.FIND_ROUTE) protected findRoute: FindRoute,
    @inject(SequenceActions.PARSE_PARAMS) protected parseParams: ParseParams,
    @inject(SequenceActions.INVOKE_METHOD) protected invoke: InvokeMethod,
    @inject(SequenceActions.SEND) public send: Send,
    @inject(SequenceActions.REJECT) public reject: Reject,
    @inject('services.SequenceService') protected sequenceService: SequenceService,
    @inject(RateLimitSecurityBindings.RATELIMIT_SECURITY_ACTION)
    protected rateLimitAction: RateLimitAction,
    @inject(AuthenticationBindings.AUTH_ACTION)
    protected authenticateRequest: AuthenticateFn,
  ) { }

  async handle(context: RequestContext) {
    const requestTime = Date.now();
    try {
      const {request, response} = context;

      // ***** IP whitelist validation start *****
      // IP whitelist
      const validIps = process.env.IP_WHITELIST ? process.env.IP_WHITELIST.split(',') : [];

      if (request?.connection?.remoteAddress && validIps.length > 0) {
        let clientIp = request.connection.remoteAddress.replace('::ffff:', '');

        if (validIps.includes(clientIp)) {
          // IP is ok, so go on
          console.log("IP ok ", clientIp);
        }
        else {
          // Invalid ip
          console.log("Bad IP: ", clientIp);
          throw new HttpErrors.Forbidden("Bad IP: " + clientIp);
        }
      }
      // ***** IP whitelist validation finish *****

      const finished = await this.invokeMiddleware(context);
      if (finished) return;

      const route = this.findRoute(request);

      // - enable jwt auth -
      // call authentication action
      await this.authenticateRequest(request);
      const args = await this.parseParams(request, route);

      // We have two actions: 500 requests per 24 hours and 1 request per .5 seconds
      const rateLimitActionNumber = 2;

      // Rate Limiter config 1 (24 hours)
      context.bind(RateLimitSecurityBindings.METADATA).to({
        enabled:true,
        options: {
          windowMs: 24 * 60 * 60 * 1000, // 24 hours
          max: rateLimitActionNumber * 500, // Limit each IP to 500 requests per `window` (here, per 24 hours)
          message: 'You have exceeded the 500 requests in 24 hours limit!'
        }
      });
      // rate limit Action here
      await this.rateLimitAction(request, response);

      // Rate Limiter config 2 (0.5 seconds)
      context.bind(RateLimitSecurityBindings.METADATA).to({
        enabled:true,
        options: {
          windowMs: .5 * 1000, // 0.5 seconds
          max: rateLimitActionNumber * 500, // Limit each IP to 1 requests per `window` (here, per 0.5 seconds)
          message: 'You have exceeded the 1 requests in 0.5 seconds limit!'
        }
      });
      // rate limit Action here
      await this.rateLimitAction(request, response);


      const result = await this.invoke(route, args);
      this.send(response, result);

      // Add logs and update last activity
      this.sequenceService.middleware(requestTime, context).then(
        () => { },
        () => { }
      );

    } catch (err) {
      // if error is coming from the JWT authentication extension
      // make the statusCode 401
      if (
        err.code === AUTHENTICATION_STRATEGY_NOT_FOUND ||
        err.code === USER_PROFILE_NOT_FOUND
      ) {
        Object.assign(err, {statusCode: 401 /* Unauthorized */});
      }

      this.reject(context, err);
    }
  }
}
