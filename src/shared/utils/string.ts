export class StringUtils {
  private static words = [
    'apple',
    'banana',
    'cherry',
    'date',
    'elderberry',
    'fig',
    'grape',
    'kiwi',
    'lemon',
    'mango',
    'nectarine',
    'orange',
    'pineapple',
    'quince',
    'raspberry',
    'strawberry',
    'tangerine',
    'ugli',
    'victoria',
    'watermelon',
    'xigua',
    'yellow',
    'zucchini',
  ];

  static capitalizeWords(str: string) {
    return str.replace(/^(.)|\s+(.)/g, (c) => c.toUpperCase());
  }
  camelToSnake(str: string): string {
    return str.replace(/([a-z0-9]|(?=[A-Z]))([A-Z])/g, '$1_$2').toLowerCase();
  }

  static containsNonAlphaChars(str: string): boolean {
    const format = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+/;
    return format.test(str);
  }

  static generateRandomAlphabets(length) {
    let result = '';
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
    const charactersLength = characters.length;
    for (let i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
  }

  static generateRandomWord() {
    const randomIndex = Math.floor(Math.random() * StringUtils.words.length);
    return (
      StringUtils.words[randomIndex] +
      '_' +
      StringUtils.generateRandomAlphabets(4)
    );
  }
}
