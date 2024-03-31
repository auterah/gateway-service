export class HashMapUtils {
  static renameProperty(obj, oldKey, newKey) {
    if (oldKey !== newKey && obj[oldKey]) {
      Object.defineProperty(
        obj,
        newKey,
        Object.getOwnPropertyDescriptor(obj, oldKey),
      );
      delete obj[oldKey];
    }

    return obj;
  }
}
