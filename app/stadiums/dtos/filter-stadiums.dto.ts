import { ApiPropertyOptional } from '@nestjs/swagger'
import { IsOptional, IsString } from 'class-validator'

export class FilterStadiumsDto {
  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  name?: string
}
