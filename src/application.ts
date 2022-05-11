import {AuthenticationComponent} from '@loopback/authentication';
import {
  JWTAuthenticationComponent, UserServiceBindings
} from '@loopback/authentication-jwt';
import {BootMixin} from '@loopback/boot';
import {ApplicationConfig} from '@loopback/core';
import {RepositoryMixin} from '@loopback/repository';
import {RestApplication, RestBindings} from '@loopback/rest';
import {
  RestExplorerBindings,
  RestExplorerComponent
} from '@loopback/rest-explorer';
import {RateLimiterComponent, RateLimitSecurityBindings} from 'loopback4-ratelimiter';
import multer from 'multer';
import path from 'path';
import {DbDataSource} from './datasources';
import {FILE_UPLOAD_SERVICE, STORAGE_DIRECTORY} from './keys';
import {MySequence} from './sequence';
import {LogErrorProvider} from './services';
const uuid = require("uuid")

export {ApplicationConfig};

export class ASchoolApiApplication extends BootMixin(
  RepositoryMixin(RestApplication),
) {
  constructor(options: ApplicationConfig = {
      cors: {
        origin: '*',
        methods: 'GET,POST,PATCH,DELETE,PUT,OPTIONS',
        preflightContinue: true,
        optionsSuccessStatus: 204,
        maxAge: 86400,
        credentials: true
      }
    }) {
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
      windowMs: 24 * 60 * 60 * 1000, // 24 hours
      max: 1000, // Limit each IP to 1000 requests per `window` (here, per 24 hours)
      message: 'You have exceeded the 1000 requests in 24 hours limit!',
    });

    // Customize @loopback/rest-explorer configuration here
    this.configure(RestExplorerBindings.COMPONENT).to({
      path: '/explorer',
    });
    this.component(RestExplorerComponent);

        // Configure file upload with multer options
    this.configureFileUpload(options.fileStorageDirectory);

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

        // Mount authentication system
        this.component(AuthenticationComponent);
        // Mount jwt component
        this.component(JWTAuthenticationComponent);
        // Bind datasource
        this.dataSource(DbDataSource, UserServiceBindings.DATASOURCE_NAME);
  }

    /**
   * Configure `multer` options for file upload
   */
     protected configureFileUpload(destination?: string) {
      // Upload files to `dist/.sandbox` by default
      destination = destination ?? path.join(__dirname, '../files');
      this.bind(STORAGE_DIRECTORY).to(destination);
      const multerOptions: multer.Options = {
        storage: multer.diskStorage({
          destination,

          filename: (req, file, cb) => {
            // generate unique file name
            file.originalname = uuid.v4() + file.originalname.split('.').pop();
            cb(null, file.originalname);
          },
        }),
      };
      // Configure the file upload service with multer options
      this.configure(FILE_UPLOAD_SERVICE).to(multerOptions);
    }
}
