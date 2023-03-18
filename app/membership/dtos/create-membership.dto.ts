import { ApiProperty } from '@nestjs/swagger'
import { IsNotEmpty, IsOptional, IsString } from 'class-validator'

export class CreateMembershipDto {
  @IsString()
  @IsOptional()
  userId: string

  @IsString()
  @IsOptional()
  teamId: string

  @ApiProperty({ required: true })
  @IsString()
  @IsNotEmpty()
  planId: string
}
