import {bind, BindingScope, inject} from '@loopback/core';
import {RequestContext} from '@loopback/rest';
import {UAParser} from 'ua-parser-js';
import {LoggerService} from '.';

@bind({ scope: BindingScope.TRANSIENT })
export class SequenceService {
  constructor(
    @inject('services.LoggerService') protected logger: LoggerService
  ) {}

  // add logs
  async middleware(
    startTime: number,
    context: RequestContext
  ): Promise<void> {
    try {
      const { request, response } = context;
      const uaParser = new UAParser(request.headers['user-agent']);
      const body = JSON.stringify(request.body);

      const headers = request.headers;
      delete headers['authorization'];

      const fields: any = {
        'api.token': request.query['access_token'],
        'client.ip': request.ip,
        'client.real_ip': JSON.stringify(request.ips),
        'http.method': request.method,
        'http.status': response.statusCode,
        'http.first_line': `${request.method} ${request.url}`,
        'http.url_path': request.url,
        'http.host': request.hostname,
        'http.query': JSON.stringify(request.query),
        'http.headers': JSON.stringify(headers),
        'http.version': request.httpVersion,
        'http.body': body,
        'http.bytes_received': request.socket.bytesRead,
        'http.bytes_send': request.socket.bytesWritten,
        'http.agent': request.headers['user-agent'],
        'client.browser': JSON.stringify(uaParser.getBrowser()),
        'client.os': JSON.stringify(uaParser.getOS()),
        'http.referrer': request.headers['referrer'],
        'http.processing_time': new Date().getTime() - startTime,
        'log.data': {
          message: `HTTP ${response.statusCode} on ${request.method} ${request.url}`,
        } /*, 'log.raw': response*/,
      };

      this.logger.info('API request', fields);
    } catch (err: any) {
      this.logger.error('Loopback log error', {
        'http.error': err.message,
        // 'client.js_stack': err.stack,
      });
    }
  }


}
