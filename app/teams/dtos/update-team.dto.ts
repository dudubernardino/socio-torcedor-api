import { ApiPropertyOptional } from '@nestjs/swagger'
import { IsEmail, IsNumber, IsOptional, IsString } from 'class-validator'

export class UpdateTeamInputDto {
  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  name?: string

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  tradeName?: string

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  @IsEmail()
  email?: string

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  mainColor?: string

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  avatar?: string

  @ApiPropertyOptional()
  @IsNumber()
  @IsOptional()
  fee?: number

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  description?: string
}
