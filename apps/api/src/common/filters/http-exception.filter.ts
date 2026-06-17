import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Response } from 'express';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(HttpExceptionFilter.name);

  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const statusCode = exception.getStatus();

    const exceptionResponse = exception.getResponse();
    let message: string;
    let errors: any = null;

    if (typeof exceptionResponse === 'string') {
      message = exceptionResponse;
    } else if (typeof exceptionResponse === 'object') {
      const resp = exceptionResponse as Record<string, any>;
      message = resp.message ?? exception.message;
      if (Array.isArray(resp.message)) {
        errors = resp.message;
        message = 'Validation failed';
      }
    } else {
      message = exception.message;
    }

    this.logger.error(`${statusCode} ${message}`, exception.stack);

    response.status(statusCode).json({
      success: false,
      statusCode,
      message,
      errors,
    });
  }
}
