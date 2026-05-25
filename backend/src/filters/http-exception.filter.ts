import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';

import { Request, Response } from 'express';

@Catch() // captura todos  os erros do back 
export class HttpExceptionFilter // verifica se o erro é do nest 
  implements ExceptionFilter
{
  catch( // método da exception filter que captura os erros  no contexto da requisição 
    exception: unknown,
    host: ArgumentsHost,
  ) {
    const ctx = host.switchToHttp();

    const response =
      ctx.getResponse<Response>();

    const request =
      ctx.getRequest<Request>();

    let status =
      HttpStatus.INTERNAL_SERVER_ERROR; // se o erro não for conhecido, lança um 500

    let message = 'Internal server error'; // mensagem default caso o erro não seja conhecido

    if (exception instanceof HttpException) {
      status = exception.getStatus();

      const exceptionResponse =
        exception.getResponse(); // retorna o objeto do erro 

      if (
        typeof exceptionResponse === 'object'
      ) {
        message =
          (exceptionResponse as any).message;
      } else {
        message = exceptionResponse;
      }
    }

    response.status(status).json({ // reposta padrão de algum erro 
      success: false,

      statusCode: status,

      message,

      timestamp: new Date().toISOString(),

      path: request.url, // qual rota gerou o erro 
    });
  }
}