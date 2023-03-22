import { ApiProperty } from '@nestjs/swagger'
import { IsNotEmpty, IsOptional, IsString } from 'class-validator'

export class CreateCheckinDto {
  @IsString()
  @IsOptional()
  userId: string

  @IsString()
  @IsOptional()
  sectorId: string

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  matchId: string
}
