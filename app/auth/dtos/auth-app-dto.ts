import { ApiProperty } from '@nestjs/swagger'
import { IsNotEmpty, IsString } from 'class-validator'

export class AuthAppDto {
  @ApiProperty({ required: true })
  @IsString()
  @IsNotEmpty()
  clientId: string

  @ApiProperty({ required: true })
  @IsString()
  @IsNotEmpty()
  secret: string
}
