import {
  IsEmail,
  IsNotEmpty,
  MinLength,
} from 'class-validator';

export class LoginDto {
  @IsEmail( // valida o email no login
    {},
    {
      message: 'Email inválido',
    },
  )
  email!: string;

  @IsNotEmpty({ // valida a senha 
    message: 'Senha obrigatória',
  })
  @MinLength(6, {
    message:
      'Senha deve ter no mínimo 6 caracteres',
  })
  password!: string;
}