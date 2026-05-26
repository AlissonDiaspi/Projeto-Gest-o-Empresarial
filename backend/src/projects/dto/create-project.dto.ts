import{
    IsNotEmpty,
    IsOptional,
    IsString
} from 'class-validator'

export class CreateProjectDto { // todo projeto tem um nome e uma descrição 
  @IsString()
  @IsNotEmpty()
  name!: string;

  @IsString()
  @IsOptional()
  description?: string;
}