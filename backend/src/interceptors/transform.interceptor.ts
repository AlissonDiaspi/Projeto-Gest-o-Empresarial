import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';

import { Observable } from 'rxjs';

import { map } from 'rxjs/operators';

@Injectable()
export class TransformInterceptor
  implements NestInterceptor
{
  intercept( // metodo da interface que é executado antes e depois da request do usuário
    context: ExecutionContext,

    next: CallHandler,
  ): Observable<any> {
    return next.handle().pipe( // executa a controller-> service e o pipe transforma a resposta na reposta padrão abaixo
      map((data) => ({
        success: true,

        data,
      })),
    );
  }
}