import { ValidatorConstraint, ValidatorConstraintInterface, ValidationArguments } from 'class-validator'

@ValidatorConstraint({ name: 'passwordConfirmation', async: false })
export class PasswordConfirmation implements ValidatorConstraintInterface {
  validate(value: any, args: ValidationArguments) {
    const [relatedPropertyName] = args.constraints
    const relatedValue = (args.object as any)[relatedPropertyName]
    return value === relatedValue
  }

  defaultMessage(args: ValidationArguments) {
    const [relatedPropertyName] = args.constraints
    return `${relatedPropertyName} and confirm${relatedPropertyName} must match`
  }
}
