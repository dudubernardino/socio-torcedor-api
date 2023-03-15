import { IsCpfCnpjValid, PasswordConfirmation } from '@lib/decorators'
import { IsEmail, IsNotEmpty, IsOptional, IsString, Matches, MinLength, Validate, ValidateIf } from 'class-validator'

export class UserInputDto {
  @IsString()
  @IsNotEmpty()
  name: string

  @IsString()
  @IsNotEmpty()
  @IsEmail()
  email: string

  @IsNotEmpty()
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
  @IsNotEmpty()
  @Matches(/^(?:\d{11}|\d{14})$/, {
    message: 'cpf or cpnj is not valid.',
  })
  @Validate(IsCpfCnpjValid)
  cpfCnpj: string

  @IsString()
  @IsNotEmpty()
  @Matches(/^\d{4}-\d{2}-\d{2}$/, {
    message: 'birthday date must be on format yyyy-mm-dd.',
  })
  dataNascimento: string
}
