import { AuthGuard } from "@nestjs/passport";


export class JwtAuthGuard extends AuthGuard( // valida token e bloqueia acesso sem auth

        'jwt',
){}
