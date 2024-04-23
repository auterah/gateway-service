import { randomBytes } from 'crypto';

export class CryptoUtil {
  static generateRandomStringAsync(length) {
    const buffer = randomBytes(length);
    return buffer.toString('hex');
  }
  static isUUID(uuid: string): boolean {
    const regex = /^[a-z,0-9,-]{36,36}$/;
    return regex.test(uuid);
  }
}
