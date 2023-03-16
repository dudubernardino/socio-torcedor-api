import { ApiProperty } from '@nestjs/swagger'

export class AuthOutputDto {
  @ApiProperty()
  accessToken: string
}
