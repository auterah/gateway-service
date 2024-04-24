import {
  ValidatorConstraint,
  ValidatorConstraintInterface,
  ValidationArguments,
} from 'class-validator';

@ValidatorConstraint({ name: 'strictObject', async: false })
export class StrictDtoValidator implements ValidatorConstraintInterface {
  validate(value: any, args: ValidationArguments) {
    if (typeof value !== 'object' || value === null || Array.isArray(value)) {
      return false;
    }

    const [dtoClass] = args.constraints;
    const dtoInstance = new dtoClass();

    for (const key of Object.keys(value)) {
      if (!(key in dtoInstance)) {
        return false;
      }
    }

    return true;
  }

  defaultMessage(args: ValidationArguments) {
    return `Invalid properties provided for ${args.property}`;
  }
}
