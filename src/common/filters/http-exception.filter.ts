import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Request, Response } from 'express';

@Catch()
export class HttpErrorFilter implements ExceptionFilter {
  private readonly logger = new Logger(HttpErrorFilter.name);

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message = 'Internal server error';
    let errorCode = 'INTERNAL_ERROR';

    if (exception instanceof HttpException) {
      status = exception.getStatus();
      const res = exception.getResponse() as any;

      if (typeof res === 'string') {
        message = res;
      } else if (res && (res.message || res.errorMessage)) {
        const msg = Array.isArray(res.message)
          ? res.message.join(', ')
          : res.message || res.errorMessage;
        message = msg;
      } else {
        message = exception.message;
      }

      // If original response includes errorCode, keep it
      errorCode =
        typeof res === 'object' && res?.errorCode
          ? res.errorCode
          : status === 400
            ? 'VALIDATION_ERROR'
            : status === 401
              ? 'UNAUTHORIZED'
              : status === 404
                ? 'NOT_FOUND'
                : 'HTTP_ERROR';
    }

    // Log the error with full details
    this.logger.error(
      `HTTP Exception: ${errorCode} - ${message}`,
      {
        errorCode,
        errorMessage: message,
        status,
        path: request.url,
        method: request.method,
        userAgent: request.get('User-Agent'),
        ip: request.ip,
        stack: exception instanceof Error ? exception.stack : undefined,
        // eslint-disable-next-line prettier/prettier
        exception: exception instanceof Error ? {
                name: exception.name,
                message: exception.message,
                stack: exception.stack,
              }
            : exception,
      },
      'HttpErrorFilter.catch',
    );

    const errorResponse = {
      errorCode,
      errorMessage: message,
      path: request.url,
      status,
    };

    return response.status(status).json(errorResponse);
  }
}
