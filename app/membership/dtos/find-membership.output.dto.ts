import { ApiProperty } from '@nestjs/swagger'
import { IsString } from 'class-validator'

export class FilterMembershipOutputDto {
  @ApiProperty()
  @IsString()
  id: string

  @ApiProperty()
  @IsString()
  name: string

  @ApiProperty()
  @IsString()
  memberships: string
}
