import {
  createParamDecorator,
  ExecutionContext,
} from '@nestjs/common';

export const CurrentOrganization =
  createParamDecorator( // cria decorators personalizados, no caso o parametro seria o @CurrentOrganization
    (
      data: unknown,
      ctx: ExecutionContext, // da acesso a requisições 
    ) => {
      const request =
        ctx.switchToHttp().getRequest(); // transforma num contexto http

      return request.params.organizationId;
    },
  );