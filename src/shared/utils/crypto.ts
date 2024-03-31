import { randomBytes } from 'crypto';

export class CryptoUtil {
  static generateRandomStringAsync(length) {
    const buffer = randomBytes(length);
    return buffer.toString('hex');
  }
}
