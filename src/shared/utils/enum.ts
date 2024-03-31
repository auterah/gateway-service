export class EnumUtils {

  static hasKey(_enum: any, key: string) {
    return Object.keys(_enum).includes(key);
  }

  static hasValue(_enum: any, value: string) {
    return Object.values(_enum).includes(value);
  }

  static getKeys(_enum: any) {
    return Object.keys(_enum);
  }
  static getValues(_enum: any) {
    return Object.values(_enum);
  }
  
}
