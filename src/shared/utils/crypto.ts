import { randomBytes } from "crypto";

export class CryptoUtil {
  static async generateRandomStringAsync(length) {
    const buffer = await randomBytes(length);
    return buffer.toString('hex');
  }
}
