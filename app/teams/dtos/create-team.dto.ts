import { ApiProperty } from '@nestjs/swagger'
import { IsEmail, IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator'

export class TeamInputDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  name: string

  @ApiProperty()
  @IsString()
  @IsOptional()
  tradeName?: string

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  taxId: string

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @IsEmail()
  email: string

  @ApiProperty()
  @IsString()
  @IsOptional()
  mainColor?: string

  @ApiProperty()
  @IsString()
  @IsOptional()
  avatar?: string

  @ApiProperty()
  @IsNumber()
  @IsOptional()
  fee?: number

  @ApiProperty()
  @IsString()
  @IsOptional()
  description?: string
}
