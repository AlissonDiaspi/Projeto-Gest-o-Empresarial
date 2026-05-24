import {Body, Controller, Post } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UseGuards, Get, Req } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';


@Controller('users')
export class UsersController {

    constructor(private usersService: UsersService){

    }

    @Post()
    async create(@Body() body: CreateUserDto){ // criar um novo usuário
        return this.usersService.create(body)

    }

    @UseGuards(JwtAuthGuard)
    @Get('me')
    getProfile(@Req()req: any){ // endpoint protegido
        return req.user;
    }

    


}
