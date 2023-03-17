import { cpf as cpfValidator, cnpj as cnpjValidator } from 'cpf-cnpj-validator'
import { ValidatorConstraint, ValidatorConstraintInterface, ValidationArguments } from 'class-validator'

@ValidatorConstraint({ name: 'cpfCnpj', async: false })
export class IsTaxIdValid implements ValidatorConstraintInterface {
  validate(value: any, args: ValidationArguments) {
    const isCpfValid = cpfValidator.isValid(value)
    const isCnpjValid = cnpjValidator.isValid(value)
    return isCpfValid || isCnpjValid
  }

  defaultMessage(args: ValidationArguments) {
    return 'taxId must be a valid CPF or CNPJ'
  }
}
