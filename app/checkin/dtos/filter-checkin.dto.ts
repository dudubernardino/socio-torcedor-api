import { ApiPropertyOptional } from '@nestjs/swagger'
import { IsOptional, IsString } from 'class-validator'

export class FilterCheckinsDto {
  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  taxId?: string
}
