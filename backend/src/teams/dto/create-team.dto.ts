// teams/dto/create-team.dto.ts
import { IsNotEmpty, IsOptional, IsString, IsUUID } from 'class-validator';

export class CreateTeamDto {
  @IsNotEmpty()
  @IsString()
  name!: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsNotEmpty()
  @IsUUID()
  organizationId!: string;
}