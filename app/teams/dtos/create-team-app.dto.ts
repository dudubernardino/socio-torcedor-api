import { ApiProperty } from '@nestjs/swagger'
import { IsOptional, IsString } from 'class-validator'

export class TeamAppInputDto {
  @ApiProperty()
  @IsString()
  @IsOptional()
  name?: string

  @ApiProperty()
  @IsString()
  @IsOptional()
  description?: string
}
