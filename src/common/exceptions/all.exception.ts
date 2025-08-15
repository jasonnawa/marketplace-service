import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Response } from 'express';
import { Logger } from '@nestjs/common';

const logger = new Logger('ExceptionService');

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest();

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message: string = 'Internal server error';

    if (exception instanceof HttpException) {
      status = exception.getStatus();
      const res = exception.getResponse();

      if (res && typeof res === 'object' && 'message' in res) {
        const msg = (res as any).message;

        if (Array.isArray(msg)) {
          message = msg.join(', ');
        } else {
          message = String(msg);
        }
      } else {
        message = String(res);
      }
    }

    logger.error(
      `HTTP ${request.method} - ${status} → ${request.url} - ${message} @ ${new Date().toISOString()}`
    );

    response.status(status).json({
      success: false,
      message,
    });
  }
}
