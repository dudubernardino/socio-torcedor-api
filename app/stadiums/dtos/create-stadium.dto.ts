import { ApiProperty } from '@nestjs/swagger'
import { IsNotEmpty, IsNumber, IsString } from 'class-validator'

class Sectors {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  name?: string

  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  capacity?: number

  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  checkinLimit?: number
}

export class CreateStadiumsDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  name: string

  @ApiProperty({ type: Sectors, isArray: true })
  @IsNotEmpty()
  sectors: Sectors[]
}
