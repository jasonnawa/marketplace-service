
import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Request, Response } from 'express';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  private readonly logger = new Logger(AllExceptionsFilter.name);

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message = 'Internal server error';

    if (exception instanceof HttpException) {
      status = exception.getStatus();
      const res = exception.getResponse();

      if (res && typeof res === 'object' && 'message' in res) {
        const msg = (res as any).message;
        message = Array.isArray(msg) ? msg.join(', ') : String(msg);
      } else {
        message = String(res);
      }
    } else if (exception instanceof Error) {
      message = exception.message || message;
    }

    this.logger.error(
      `Error on ${request.method} ${request.url} → ${status}: ${message}`,
      (exception as any)?.stack,
    );

    response.status(status).json({
      success: false,
      message,
    });
  }
}
