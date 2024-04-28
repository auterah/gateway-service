export class ArrayUtils {
  static removeDuplicates(list: string[]): string[] {
    return list.filter(
      (value, index, array) =>
        index ===
        array.findIndex((item) => {
          return item === value;
        }),
    );
  }
}
