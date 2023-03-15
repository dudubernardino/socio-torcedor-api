import { PasswordConfirmation } from '@lib/decorators'
import { IsEmail, IsNotEmpty, IsOptional, IsString, Matches, MinLength, Validate, ValidateIf } from 'class-validator'

export class UpdateUserInputDto {
  @IsString()
  @IsOptional()
  name: string

  @IsString()
  @IsOptional()
  @IsEmail()
  email: string

  @IsOptional()
  @MinLength(8)
  @IsString()
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*()_+~`|}{[\]:\\;"'<,>.?/]).+$/, {
    message:
      'password must contain at least one lowercase letter, one uppercase letter, one number, one special character and at least 8 characters long.',
  })
  password: string

  @IsOptional()
  @ValidateIf((object, value) => value !== '')
  @IsNotEmpty()
  @Validate(PasswordConfirmation, ['password'])
  confirmPassword: string

  @IsString()
  @IsOptional()
  endereco?: string

  @IsString()
  @IsOptional()
  complemento?: string

  @IsString()
  @IsOptional()
  bairro?: string

  @IsString()
  @IsOptional()
  numero?: string

  @IsString()
  @IsOptional()
  cep?: string

  @IsString()
  @IsOptional()
  telefoneResidencial?: string

  @IsString()
  @IsOptional()
  telefoneComercial?: string

  @IsString()
  @IsOptional()
  telefoneCelular?: string
}
