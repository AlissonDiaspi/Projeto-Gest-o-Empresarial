import {BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service'
import { CreateUserDto } from './dto/create-user.dto';

import * as bcrypt from 'bcrypt'


@Injectable()
export class UsersService {

    constructor(private prisma: PrismaService){

    }

    async create(data: CreateUserDto){
        const userExists = await this.prisma.user.findUnique({
            where: {
                email: data.email,
            },
        });
        if(userExists){
            throw new BadRequestException("Email já registrado") // verifica se o email ja existe com algum usuario, se existir, lança esse erro
        }

        const hashedPassword = await bcrypt.hash(data.password,10); // criptografa a senha

        return this.prisma.user.create({
            data:{
                name: data.name,
                email : data.email,
                password: hashedPassword,
            },
        });
    }
    async findByEmail(email: string){ // método para buscar usuario pelo email
        return this.prisma.user.findUnique({
            where:{
                email,
            },
        });

    }
}
        
