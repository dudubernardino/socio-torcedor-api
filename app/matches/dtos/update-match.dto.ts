import { ApiProperty } from '@nestjs/swagger'
import { IsISO8601, IsNumber, IsOptional, IsString } from 'class-validator'

export class UpdateMatchDto {
  @ApiProperty()
  @IsString()
  @IsOptional()
  stadiumId?: string

  @ApiProperty()
  @IsString()
  @IsOptional()
  homeTeam?: string

  @ApiProperty()
  @IsNumber()
  @IsOptional()
  homeTeamScore: number

  @ApiProperty()
  @IsString()
  @IsOptional()
  awayTeam?: string

  @ApiProperty()
  @IsNumber()
  @IsOptional()
  awayTeamScore: number

  @ApiProperty()
  @IsISO8601()
  @IsOptional()
  startTime?: string
}
