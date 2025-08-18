import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
} from '@nestjs/common';

@Catch()
export class HttpErrorFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const request = ctx.getRequest();

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message = 'Internal server error';

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
      const errorCode =
        typeof res === 'object' && res?.errorCode
          ? res.errorCode
          : status === 400
            ? 'VALIDATION_ERROR'
            : status === 401
              ? 'UNAUTHORIZED'
              : status === 404
                ? 'NOT_FOUND'
                : 'HTTP_ERROR';

      return response
        .status(status)
        .json({ errorCode, errorMessage: message, path: request.url, status });
    }

    return response.status(status).json({
      errorCode: 'INTERNAL_ERROR',
      errorMessage: message,
      path: request.url,
      status,
    });
  }
}
