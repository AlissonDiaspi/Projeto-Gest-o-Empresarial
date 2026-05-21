import {Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';

@Controller('auth')
export class AuthController {

    constructor(private authService: AuthService){}
    
    @Post('login')
    async login(@Body() body: LoginDto){ // endpoint para login com jwt
        return this.authService.login(body)
    }
}
