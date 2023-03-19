import { ApiProperty } from '@nestjs/swagger'
import { IsISO8601, IsNotEmpty, IsString } from 'class-validator'

export class MatchInputDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  stadiumId: string

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  homeTeam: string

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  awayTeam: string

  @ApiProperty()
  @IsISO8601()
  @IsNotEmpty()
  startTime: string
}
