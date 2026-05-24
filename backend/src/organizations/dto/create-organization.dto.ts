import { IsNotEmpty } from "class-validator";


export class CreateOrganizationDto{ // classe responsável por um usuário criar uma organização 
    
    @IsNotEmpty()
    name!: string; 
}