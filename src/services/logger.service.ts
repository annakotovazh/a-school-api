import {bind, /* inject, */ BindingScope} from '@loopback/core';

@bind({ scope: BindingScope.APPLICATION })
export class LoggerService {
  constructor(/* Add @inject to inject parameters */) { }
  defaults = {
    'log.type': 'a-school-api',
    'api.version': process.env.npm_package_version,
};

protected log(message: string, fields: any = {}) {
    if (typeof fields['log.data'] !== 'string') {
        fields['log.data'] = JSON.stringify(fields['log.data']);
    }

    process.stdout.write(
        JSON.stringify({
            ...this.defaults,
            'log.message': message,
            'log.timestamp': new Date().toISOString(),
            ...fields,
        }) + '\n'
    );
}

public debug(message: string, fields?: {} | undefined) {
    this.log(message, { ...fields, 'log.level': 'debug' });
}

public info(message: string, fields?: {} | undefined) {
    this.log(message, { ...fields, 'log.level': 'info' });
}

public error(
    message: string,
    fields?: {} | undefined /*, e = new Error()*/
) {
    //newrelic.noticeError(e);
    this.log(message, {
        ...fields,
        /* 'client.js_stack': e.stack,*/ 'log.level': 'error',
    });
}

warn(message: string, fields?: {} | undefined) {
    this.log(message, {
        ...fields,
        // 'client.js_stack': new Error().stack,
        'log.level': 'warning',
    });
}
}
