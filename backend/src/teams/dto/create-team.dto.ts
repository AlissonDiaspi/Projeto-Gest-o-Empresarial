import {
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreateTeamDto {
  @IsString()
  @IsNotEmpty()
  name!: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsString()
  @IsNotEmpty()
  organizationId!: string;
}