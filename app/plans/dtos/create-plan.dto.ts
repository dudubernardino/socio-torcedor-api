import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator'

export class PlanInputDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  name: string

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  description?: string

  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  price: number

  @ApiProperty({ isArray: true })
  @IsNotEmpty()
  sectors: any[]
}
