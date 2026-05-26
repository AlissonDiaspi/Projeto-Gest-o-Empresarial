import {
  IsOptional,
  IsString,
} from 'class-validator';

export class UpdateProjectDto { // como é update, os dois parametros são opcionais 
  @IsString()
  @IsOptional()
  name?: string;

  @IsString()
  @IsOptional()
  description?: string;
}

