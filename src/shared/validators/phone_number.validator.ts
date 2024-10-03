import {
  registerDecorator,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
  ValidationArguments,
} from 'class-validator';

type CountyCodePattern = { country: string; code: RegExp };

@ValidatorConstraint({ async: false })
class IsMultiCountryCodeConstraint implements ValidatorConstraintInterface {
  static patterns: CountyCodePattern[] = [
    {
      country: 'Nigeria',
      code: /^\+234\d{10}$/, // Nigeria: +234 followed by 10 digits
    },
    // {
    //   country: 'United Kingdom',
    //   code: /^\+44\d{10}$/, // UK: +44 followed by 10 digits
    // },
    // {
    //   country: 'United States',
    //   code: /^\+1\d{10}$/, // USA: +1 followed by 10 digits
    // },
  ];

  private findCountryCode(pattern: string) {
    const match = pattern.match(/\+\d*/);
    return !match ? null : match[0];
  }

  private get allowedCountries() {
    return IsMultiCountryCodeConstraint.patterns
      .map((pattern) => pattern.country)
      .filter(Boolean);
  }

  private get supportedRegions() {
    return IsMultiCountryCodeConstraint.patterns.map(
      (pattern) =>
        `${pattern.country} (${this.findCountryCode(pattern.code.toString())})`,
    );
  }

  private findCountry(code: RegExp) {
    return IsMultiCountryCodeConstraint.patterns.find(
      (pattern) => pattern.code === code,
    ).country;
  }

  private get allowedCodes() {
    return IsMultiCountryCodeConstraint.patterns
      .map((pattern) => pattern.code)
      .filter(Boolean);
  }

  validate(phoneNumber: string, args: ValidationArguments) {
    return IsMultiCountryCodeConstraint.patterns.some(({ code }) =>
      code.test(phoneNumber),
    ); // Check if the phone number matches any of the patterns
  }

  defaultMessage(args: ValidationArguments) {
    return `Invalid phone number. Supported regions: ${this.supportedRegions.toString()}`;
  }
}

export function IsMultiCountryCode(validationOptions?: ValidationOptions) {
  return function (object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [],
      validator: IsMultiCountryCodeConstraint,
    });
  };
}
