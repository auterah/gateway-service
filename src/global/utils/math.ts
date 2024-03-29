export class MathUtils {
  static roundNumber(amount: number): number {
    return amount ? +amount.toFixed(2) : amount;
  }
}
