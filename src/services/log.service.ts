import {Provider} from '@loopback/context';
import {service} from '@loopback/core';
import {LogError, Request} from '@loopback/rest';
import {UAParser} from 'ua-parser-js';
import {LoggerService} from '../services';

export class LogErrorProvider implements Provider<LogError> {
  constructor(
    @service(LoggerService) protected logger: LoggerService,
  ) {}

  value(): LogError {
    return (err, statusCode, req) => this.action(err, statusCode, req);
  }

  async action(err: Error, statusCode: number, req: Request) {
    const uaParser = new UAParser(req.headers['user-agent']);

    const headers = req.headers;
    delete headers['authorization'];

    const fields: any = {
      'client.ip': req.ip,
      'client.real_ip': JSON.stringify(req.ips),
      'http.method': req.method,
      'http.first_line': `${req.method} ${req.url}`,
      'http.url_path': req.url,
      'http.host': req.hostname,
      'http.query': JSON.stringify(req.query),
      'http.headers': JSON.stringify(headers),
      'http.version': req.httpVersion,
      'http.body': JSON.stringify(req.body),
      'http.error': err.message,
      // 'client.js_stack': err.stack,
      'http.bytes_received': req.socket.bytesRead,
      'http.bytes_send': req.socket.bytesWritten,
      'http.status': statusCode,
      'http.agent': req.headers['user-agent'],
      'client.browser': JSON.stringify(uaParser.getBrowser()),
      'client.os': JSON.stringify(uaParser.getOS()),
      'http.referrer': req.headers['referrer'],
      'log.data': {
        message: `HTTP ${statusCode} on ${req.method} ${req.url}: ${err.message}`,
      },
    };


    if (statusCode < 500 && ![401, 404].includes(statusCode)) {
      this.logger.error('Loopback error', fields);
    } else {
      this.logger.warn('Loopback warning', fields);
    }
  }
}
