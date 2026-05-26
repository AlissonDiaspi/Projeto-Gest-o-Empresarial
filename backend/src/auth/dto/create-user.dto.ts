import {
    IsEmail,
    IsNotEmpty,
    MinLength
} from 'class-validator'


export class CreateUserDto{
    @IsNotEmpty({ // valida o nome na criação
        message: 'Nome é obrigatório'
    })
    name!: string;


    @IsEmail( // valida o email
        {},
        {
            message : 'Email invalido'
        },
    )
    email!: string;

     @MinLength(6, { // valida a senha
    message:
      'Senha deve ter no mínimo 6 caracteres',
  })
  password!: string;

}