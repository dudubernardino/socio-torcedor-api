import { EntityStatus } from '@lib/enums'
import { ApiPropertyOptional } from '@nestjs/swagger'
import { IsEmail, IsEnum, IsOptional, IsString } from 'class-validator'

export class FilterTeamDto {
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
  taxId?: string

  @ApiPropertyOptional()
  @IsEnum(EntityStatus)
  @IsOptional()
  status?: EntityStatus

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  @IsEmail()
  email?: string
}
