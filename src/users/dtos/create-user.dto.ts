import { IsEmail, IsNotEmpty, IsString } from 'class-validator'

export class UserInputDto {
  @IsString()
  @IsNotEmpty()
  name: string

  @IsString()
  @IsNotEmpty()
  @IsEmail()
  email: string

  @IsString()
  @IsNotEmpty()
  secret: string
}
