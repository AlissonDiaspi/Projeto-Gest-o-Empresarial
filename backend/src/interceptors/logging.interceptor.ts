import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';

import { Observable } from 'rxjs';

import { tap } from 'rxjs/operators';

@Injectable()
export class LoggingInterceptor
  implements NestInterceptor
{
  intercept(
    context: ExecutionContext,

    next: CallHandler,
  ): Observable<any> {
    const request =
      context.switchToHttp().getRequest();

    const method = request.method; // pega gets, posts, put e deletes

    const url = request.url; // pega a rota atual 

    const now = Date.now(); // retorna o timestamp atual 

    return next.handle().pipe( // executa a controller e a service e o pipe padroniza a mensagem 
      tap(() => {
        const time =
          Date.now() - now;

        console.log(
          `[${method}] ${url} - ${time}ms`,
        );
      }),
    );
  }
}