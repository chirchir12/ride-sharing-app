import { HttpException, HttpStatus } from '@nestjs/common';

export class CustomHttpException extends HttpException {
  constructor(message?: string, statusCode?: number) {
    super(
      {
        message: message,
        statusCode: statusCode || HttpStatus.BAD_REQUEST,
        error: true,
      },
      statusCode || HttpStatus.BAD_REQUEST,
    );
  }
}
