import { ApiProperty } from '@nestjs/swagger'
import { IsNotEmpty, IsOptional, IsString } from 'class-validator'

export class FilterMembershipDto {
  @IsString()
  @IsOptional()
  userId: string

  @IsString()
  @IsOptional()
  teamId: string

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  membershipId: string
}
