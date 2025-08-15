import { HttpException, HttpStatus } from '@nestjs/common';

export class CustomHttpException extends HttpException {
  constructor(message: string, statusCode: HttpStatus = HttpStatus.BAD_REQUEST, errors: any = null) {
    super(
      {
        success: false,
        message,
        errors,
      },
      statusCode,
    );
    
  }
}
