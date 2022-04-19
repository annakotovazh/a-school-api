import {inject} from '@loopback/core';
import {FindRoute, InvokeMethod, ParseParams, Reject, RequestContext, Send, SequenceActions, SequenceHandler} from '@loopback/rest';
import {RateLimitAction, RateLimitSecurityBindings} from 'loopback4-ratelimiter';
import {SequenceService} from './services';

export class MySequence implements SequenceHandler {
  constructor(
    @inject(SequenceActions.FIND_ROUTE) protected findRoute: FindRoute,
    @inject(SequenceActions.PARSE_PARAMS) protected parseParams: ParseParams,
    @inject(SequenceActions.INVOKE_METHOD) protected invoke: InvokeMethod,
    @inject(SequenceActions.SEND) public send: Send,
    @inject(SequenceActions.REJECT) public reject: Reject,
    @inject('services.SequenceService') protected sequenceService: SequenceService,
    @inject(RateLimitSecurityBindings.RATELIMIT_SECURITY_ACTION)
    protected rateLimitAction: RateLimitAction,
  ) { }

  async handle(context: RequestContext) {
    const requestTime = Date.now();
    try {
      const {request, response} = context;
      const route = this.findRoute(request);
      const args = await this.parseParams(request, route);

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
      this.reject(context, err);
    }
  }
}
