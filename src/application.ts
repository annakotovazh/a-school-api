import {BootMixin} from '@loopback/boot';
import {ApplicationConfig} from '@loopback/core';
import {RepositoryMixin} from '@loopback/repository';
import {RestApplication, RestBindings} from '@loopback/rest';
import {
  RestExplorerBindings,
  RestExplorerComponent
} from '@loopback/rest-explorer';
import {RateLimiterComponent, RateLimitSecurityBindings} from 'loopback4-ratelimiter';
import path from 'path';
import {MySequence} from './sequence';
import {LogErrorProvider} from './services';

export {ApplicationConfig};

export class ASchoolApiApplication extends BootMixin(
  RepositoryMixin(RestApplication),
) {
  constructor(options: ApplicationConfig = {}) {
    super(options);

    // Logs
    this.bind(RestBindings.SequenceActions.LOG_ERROR).toProvider(
      LogErrorProvider
    );

    // Set up the custom sequence
    this.sequence(MySequence);

    // Set up default home page
    this.static('/', path.join(__dirname, '../public'));

    // connect rate limit
    this.component(RateLimiterComponent);
    this.bind(RateLimitSecurityBindings.CONFIG).to({
      name: 'myredis',
      type: 'RedisStore',
      windowMs: 1 * 60 * 1000, // 24 hours
      max: 1000, // Limit each IP to 1000 requests per `window` (here, per 24 hours)
      message: 'You have exceeded the 1000 requests in 24 hours limit!',
    });

    // Customize @loopback/rest-explorer configuration here
    this.configure(RestExplorerBindings.COMPONENT).to({
      path: '/explorer',
    });
    this.component(RestExplorerComponent);

      this.projectRoot = __dirname;
    // Customize @loopback/boot Booter Conventions here
    this.bootOptions = {
      controllers: {
        // Customize ControllerBooter Conventions here
        dirs: ['controllers'],
        extensions: ['.controller.js'],
        nested: true,
      },
    };
  }
}
