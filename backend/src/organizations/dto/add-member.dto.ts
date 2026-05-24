import { IsEmail } from 'class-validator';

export class AddMemberDto { // valida o email do usuário convidado
  @IsEmail()
  email!: string;
}