import { UnauthorizedException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UsersService } from 'src/users/users.service';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {

    constructor(private usersService: UsersService,
        private jwtService: JwtService,
    ){}
    
    async login(data: LoginDto){
        const user = await this.usersService.findByEmail(
            data.email
        );
        if(!user){
            throw new UnauthorizedException(
                'credenciais invalidas',
            );
        }
        const passwordMatch = await bcrypt.compare( // compara a senha digitada e o hash salvo
            data.password,
            user.password
        );
        if(!passwordMatch){
            throw new UnauthorizedException(
                'credenciais invalidas'
            );
        }
        const payload = {
            sub:user.id,
            email : user.email

        };
        return{
            acess_token:
            await this.jwtService.signAsync(payload)
        };
    }
}
